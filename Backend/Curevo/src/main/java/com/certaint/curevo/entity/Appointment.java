package com.certaint.curevo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.certaint.curevo.enums.AppointmentStatus;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String name;

    @Column(nullable = true)
    private String age;

    @Column(nullable = true)
    private String phone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(nullable = false)
    private BigDecimal baseAmount;

    @Column(nullable = false)
    private BigDecimal serviceCharge;

    @Column(nullable = false)
    private BigDecimal extraCharge;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = true)
    private String prescription;


    @PrePersist
    @PreUpdate
    public void calculateTotalAmount() {
        if (this.baseAmount == null) this.baseAmount = BigDecimal.ZERO;
        if (this.serviceCharge == null) this.serviceCharge = BigDecimal.ZERO;
        if (this.extraCharge == null) this.extraCharge = BigDecimal.ZERO;
        this.totalAmount = this.baseAmount.add(this.serviceCharge).add(this.extraCharge);
    }
}