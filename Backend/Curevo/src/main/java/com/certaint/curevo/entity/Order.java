package com.certaint.curevo.entity;


import com.certaint.curevo.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

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

    // Store fulfilling the order
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    // Delivery details
    private String recipientName;
    private String deliveryInstructions;
    private String deliveryAddress;
    private Double deliveryLat;
    private Double deliveryLng;

    // Prescription
    private String prescriptionUrl;
    private Boolean prescriptionVerified;

    // Payment
    private BigDecimal totalAmount;
    private String paymentMethod;
    private Boolean isPaid;

    // Status
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    // Timestamps
    private Instant placedAt;
    private Instant updatedAt;
}
