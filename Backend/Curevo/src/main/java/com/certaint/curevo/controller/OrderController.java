package com.certaint.curevo.controller;



import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.dto.OrderRequestDTO;
import com.certaint.curevo.entity.CartItem;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Order;
import com.certaint.curevo.entity.Payment;
import com.certaint.curevo.enums.PaymentStatus;
import com.certaint.curevo.security.JwtService;
import com.certaint.curevo.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtService jwtService;
    private final CustomerService customerService;
    private final PaymentService paymentService;
    private final CartItemService cartItemService;
    private final ExecutiveService executiveService;

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.save(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<Order>>> getAll() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Orders retrieved successfully", orderService.findAll())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ApiResponse<Payment> createOrder(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart("order") OrderRequestDTO orderRequestDTO,
            @RequestPart(value = "prescription", required = false) MultipartFile prescriptionFile) {

        Optional<Customer> optCustomer = getAuthenticatedCustomer(authHeader);
        if (optCustomer.isEmpty()) {
            return new ApiResponse<>(false, "Unauthorized", null);
        }

        Customer customer = optCustomer.get();

        // Convert DTO to Entity
        Order order = new Order();
        order.setCustomer(customer);
        order.setDeliveryAddress(orderRequestDTO.getAddress());
        order.setRecipientEmail(orderRequestDTO.getEmail());
        order.setRecipientName(orderRequestDTO.getName());
        order.setRecipientPhone(orderRequestDTO.getPhone());
        order.setDeliveryInstructions(orderRequestDTO.getInstructions());
        order.setDeliveryLat(orderRequestDTO.getLat());
        order.setDeliveryLng(orderRequestDTO.getLng());

        List<CartItem> cartItems = cartItemService.getCartItemsByCustomer(customer);

        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate amounts
        BigDecimal minimumOrderAmount = BigDecimal.valueOf(300);
        BigDecimal platformFee = BigDecimal.TEN;
        BigDecimal deliveryCharges = subtotal.compareTo(minimumOrderAmount) < 0 ? BigDecimal.valueOf(50) : BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(platformFee).add(deliveryCharges);
        totalAmount = subtotal.multiply(BigDecimal.valueOf(0.18)); // 18% GST

        order.setTotalAmount(totalAmount);

        // Save Order
        Order newOrder = orderService.createOrder(customer, order, prescriptionFile);

        // Create Payment
        Payment payment = new Payment();
        payment.setOrder(newOrder);
        payment.setAmount(newOrder.getTotalAmount());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setMethod("ONLINE");

        Payment savedPayment = paymentService.createPayment(payment);

        // 💥 Assign Order to Executive AFTER Payment Success
        try {
            executiveService.assignOrder(newOrder);
        } catch (RuntimeException e) {
            return new ApiResponse<>(true, "Order created and payment completed, but no executive available at the moment", savedPayment);
        }

        return new ApiResponse<>(true, "Order and Payment created and assigned successfully", savedPayment);
    }


    @GetMapping("/me")
    public ApiResponse<List<Order>> getAllByCustomer(
            @RequestHeader("Authorization") String authHeader) {

        Optional<Customer> optCustomer = getAuthenticatedCustomer(authHeader);
        if (optCustomer.isEmpty()) {
            return new ApiResponse<>(false, "Unauthorized", null);
        }

        Customer customer = optCustomer.get();
        List<Order> orders = orderService.findAllByCustomer(customer);

        return new ApiResponse<>(true, "Orders retrieved successfully", orders);
    }


    private Optional<Customer> getAuthenticatedCustomer(String authHeader) {

        String jwt = authHeader.substring(7);
        String customerEmail = jwtService.extractEmail(jwt);

        if (customerEmail == null) {
            return Optional.empty();
        }
        return customerService.getByEmail(customerEmail);
    }
    @PostMapping("/verify-prescription/{Id}")
    public ApiResponse<Boolean> verifyPrescription(@PathVariable Long Id) {
        Boolean status = orderService.verifyPrescription(Id);
        return new ApiResponse<>(true, "Prescription verified", status);
    }

}
