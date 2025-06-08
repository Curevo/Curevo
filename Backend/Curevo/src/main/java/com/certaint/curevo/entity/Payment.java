package com.certaint.curevo.entity;

import com.certaint.curevo.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrementing primary key
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount; // Use BigDecimal for currency to avoid precision issues


    @Enumerated(EnumType.STRING) // Specifies that the Enum should be stored as a String in the database
    @Column(nullable = false, length = 20)
    private PaymentStatus status; // Using the PaymentStatus Enum

    @Column(length = 50)
    private String method; // E.g., "CREDIT_CARD", "UPI", "NET_BANKING", "CASH"

    @OneToOne(fetch = FetchType.EAGER) // Consider LAZY if Appointment/Order details aren't always needed with Payment
    @JoinColumn(name = "appointment_id", nullable = true)
    @JsonBackReference("appointment-payment") // Prevents infinite recursion during serialization
    private Appointment appointment;

    @OneToOne(fetch = FetchType.EAGER) // Consider LAZY if Appointment/Order details aren't always needed with Payment
    @JoinColumn(name = "order_id", nullable = true)
    private Order order;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Lifecycle callbacks to set createdAt and updatedAt timestamps automatically
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}