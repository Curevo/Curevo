package com.certaint.curevo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clinics")
@Getter
@Setter
@NoArgsConstructor
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clinicId;

    private String name;

    @Column(nullable = false)
    private String address;

    private Double latitude;

    private Double longitude;

    private String phoneNumber;
}
