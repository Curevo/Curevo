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

    private Instant assignedAt;
    private Instant updatedAt;
    private Instant estimatedArrival;
    private Instant actualDelivery;
}
