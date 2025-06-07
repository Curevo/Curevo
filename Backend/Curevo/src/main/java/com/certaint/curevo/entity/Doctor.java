package com.certaint.curevo.entity;

import com.certaint.curevo.enums.Specialization;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "doctors")
@ToString
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doctorId;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "name")
    private String name;

    @Column(name = "qualification")
    private String qualification;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Specialization specialization;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<DoctorAvailability> availabilities = new HashSet<>();

    @Column(name = "image_url")
    private String image;

    @ManyToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

}
