package com.certaint.curevo.entity;

import com.certaint.curevo.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private String name;

    private String phone;

    private String email;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String prescription;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;


    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    private LocalDateTime createdAt = LocalDateTime.now();

}

