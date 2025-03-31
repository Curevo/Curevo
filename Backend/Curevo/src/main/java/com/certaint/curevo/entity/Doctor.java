package com.certaint.curevo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long doctorId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true) // Link to User table
    private User user;

    private String specialization;
    private String availableDays;  // Example: "Monday, Wednesday, Friday"
    private String availableTime;  // Example: "10:00 AM - 5:00 PM"
}
