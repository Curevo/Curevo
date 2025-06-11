package com.certaint.curevo.entity;


import com.certaint.curevo.enums.DeliveryAssignmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "delivery_assignments")
public class DeliveryAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "executive_id", nullable = false)
    private DeliveryExecutive executive;

    @Enumerated(EnumType.STRING)
    private DeliveryAssignmentStatus status;

    @Column(nullable = false, updatable = false) // assignedAt should not be updatable manually
    private Instant assignedAt;

    @Column(nullable = false)
    private Instant updatedAt;


    private Instant actualDelivery; // This records when the delivery was actually completed

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        assignedAt = now; // Set assignedAt only on creation
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now(); // Update updatedAt on every modification
    }
}
