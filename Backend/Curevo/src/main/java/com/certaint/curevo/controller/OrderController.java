package com.certaint.curevo.controller;



import com.azure.core.annotation.Post;
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.dto.OrderRequestDTO;
import com.certaint.curevo.entity.*;
import com.certaint.curevo.enums.OrderStatus;
import com.certaint.curevo.enums.PaymentStatus;
import com.certaint.curevo.security.JwtService;
import com.certaint.curevo.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.Set;


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
        BigDecimal gstRate = BigDecimal.valueOf(0.18);
        BigDecimal taxableAmount = subtotal.add(platformFee).add(deliveryCharges);

        // Calculate GST amount: taxableAmount * 18%
        // Use RoundingMode.HALF_UP for standard rounding in financial contexts
        BigDecimal gstAmount = taxableAmount.multiply(gstRate).setScale(2, RoundingMode.HALF_UP);

        // Final Total Amount: taxableAmount + gstAmount
        BigDecimal finalTotalAmount = taxableAmount.add(gstAmount).setScale(2, RoundingMode.HALF_UP);

        order.setTotalAmount(finalTotalAmount);

        // Save Order
        Order newOrder = orderService.createOrder(customer, order, prescriptionFile);

        // Create Payment
        Payment payment = new Payment();
        payment.setOrder(newOrder);
        payment.setAmount(newOrder.getTotalAmount());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setMethod("ONLINE");

        Payment savedPayment = paymentService.createPayment(payment);


        if (newOrder.getStatus() != OrderStatus.NEEDS_VERIFICATION) {
            try {
                executiveService.assignOrder(newOrder);
                return new ApiResponse<>(true, "Order, Payment created and assigned successfully", savedPayment);
            } catch (RuntimeException e) {
                return new ApiResponse<>(true, "Order created and payment completed, but no executive available at the moment.", savedPayment);
            }
        } else {
            // If the order status is NEEDS_VERIFICATION, it's not ready for executive assignment.
            return new ApiResponse<>(true, "Order created and payment completed. Awaiting prescription verification before executive assignment.", savedPayment);
        }

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
    @DeleteMapping("/delete/{id}")
    public void DeleteOrder(@PathVariable Long id) {
        orderService.deleteById(id);
    }
    @PostMapping("/cancel/{id}")
    public ApiResponse<Order> cancelOrder(@PathVariable Long id) {
        Optional<Order> orderOpt = orderService.findById(id);
        if (orderOpt.isEmpty()) {
            return new ApiResponse<>(false, "Order not found", null);
        }

        Order order = orderOpt.get();
        if (order.getStatus() == OrderStatus.CANCELLED) {
            return new ApiResponse<>(false, "Order is already cancelled", null);
        }

        // --- NEW LOGIC: Handle Delivery Assignments ---
        // Retrieve the collection of delivery assignments.
        // This will trigger a lazy load if the collection is not already initialized.
        Set<DeliveryAssignment> deliveryAssignments = order.getDeliveryAssignments();
        if (deliveryAssignments != null && !deliveryAssignments.isEmpty()) {
            deliveryAssignments.clear();
        }


        Payment payment = order.getPayment();
        // Assuming a cancelled order means the payment should be marked as refunded
        if (payment != null) { // Defensive check
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentService.save(payment);
        }


        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderService.save(order);
        executiveService.processPendingOrders();

        return new ApiResponse<>(true, "Order cancelled successfully", updatedOrder);
    }

}
