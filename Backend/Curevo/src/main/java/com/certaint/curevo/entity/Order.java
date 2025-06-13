package com.certaint.curevo.entity;

import com.certaint.curevo.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User placing the order
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // Delivery details
    private String recipientName;
    private String recipientPhone;
    private String recipientEmail;
    private String deliveryInstructions;
    private String deliveryAddress;
    private Double deliveryLat;
    private Double deliveryLng;

    // Prescription
    private String prescriptionUrl;
    private Boolean prescriptionVerified=true;

    // Payment
    private BigDecimal totalAmount = BigDecimal.ZERO;

    // Status
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference("order-items")
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "order", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonBackReference("order-assignment")
    private Set<DeliveryAssignment> deliveryAssignments = new HashSet<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("order-payment") // CORRECT: This tells Jackson to IGNORE the 'payment' field when serializing Order
    private Payment payment;

    // Timestamps
    private Instant placedAt;
    private Instant updatedAt;

    // Automatically set timestamps
    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.placedAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
