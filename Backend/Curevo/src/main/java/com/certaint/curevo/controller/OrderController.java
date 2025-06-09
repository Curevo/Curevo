package com.certaint.curevo.controller;



import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Order;
import com.certaint.curevo.entity.Payment;
import com.certaint.curevo.enums.PaymentStatus;
import com.certaint.curevo.security.JwtService;
import com.certaint.curevo.service.CustomerService;
import com.certaint.curevo.service.OrderService;
import com.certaint.curevo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ApiResponse<Payment> createOrder(@RequestHeader("Authorization") String authHeader,Order order) {
        Optional<Customer> optCustomer = getAuthenticatedCustomer(authHeader);
        if (optCustomer.isEmpty()) {
            return new ApiResponse<>(false, "Unauthorized", null);
        }

        Customer customer = optCustomer.get();

        Order newOrder = orderService.createOrder(customer,order);

        BigDecimal minimumOrderAmount = BigDecimal.valueOf(300);
        BigDecimal platformFee = BigDecimal.TEN;
        BigDecimal deliveryCharges = BigDecimal.ZERO;

        if (newOrder.getTotalAmount().compareTo(minimumOrderAmount) < 0) {
            deliveryCharges=(BigDecimal.valueOf(50));
        }
        BigDecimal totalAmount = newOrder.getTotalAmount()
                .add(platformFee)
                .add(deliveryCharges);

        // 3️⃣ Create the payment for the order
        Payment payment = new Payment();
        payment.setOrder(newOrder);
        payment.setAmount(totalAmount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setMethod("ONLINE"); // or whatever your default is

        Payment savedPayment = paymentService.createPayment(payment);

        // 4️⃣ Return the Payment as the response
        return new ApiResponse<>(true, "Order and Payment created successfully", savedPayment);
    }


    private Optional<Customer> getAuthenticatedCustomer(String authHeader) {

        String jwt = authHeader.substring(7);
        String customerEmail = jwtService.extractEmail(jwt);

        if (customerEmail == null) {
            return Optional.empty();
        }
        return customerService.getByEmail(customerEmail);
    }
}
