package com.certaint.curevo.entity;

import com.certaint.curevo.enums.DeliveryExecutiveStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "delivery_executives")
public class DeliveryExecutive {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double currentLat;
    private Double currentLng;

    @Enumerated(EnumType.STRING)
    private DeliveryExecutiveStatus status;

    private String vehicleType;

    private Instant updatedAt;  // Combined timestamp for location and profile updates

    private Instant createdAt;  // When the executive record was created
}
