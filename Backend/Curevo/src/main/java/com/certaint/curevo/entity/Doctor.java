package com.certaint.curevo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long doctorId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true) // Link to User table
    private User user;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String availableDays;

    @Column(nullable = false)
    private String availableTime;
}
