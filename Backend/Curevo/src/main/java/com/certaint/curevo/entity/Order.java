package com.certaint.curevo.entity;

import com.certaint.curevo.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<OrderItem> orderItems;

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
