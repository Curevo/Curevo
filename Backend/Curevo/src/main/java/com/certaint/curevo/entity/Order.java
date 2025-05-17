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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Store fulfilling the order
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    // Delivery details
    private String recipientName;         // Name for delivery (can differ from user)
    private String deliveryInstructions;  // Optional notes
    private String deliveryAddress;
    private Double deliveryLat;
    private Double deliveryLng;

    // Prescription
    private String prescriptionUrl;       // Temporarily stored until verified
    private Boolean prescriptionVerified; // Flag after admin/doctor verification

    // Payment
    private BigDecimal totalAmount;
    private String paymentMethod;         // "COD" or "ONLINE"
    private Boolean isPaid;

    // Status
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    // Timestamps
    private Instant placedAt;
    private Instant updatedAt;
}
