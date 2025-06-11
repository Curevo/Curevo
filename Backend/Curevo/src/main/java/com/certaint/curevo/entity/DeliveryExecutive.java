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

    @Enumerated(EnumType.STRING)
    private DeliveryExecutiveStatus status=DeliveryExecutiveStatus.NOT_VERIFIED;

    private String image;

    private String name;

    private String vehicleType;

    private Instant updatedAt;

    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
