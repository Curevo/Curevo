package com.certaint.curevo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name="customers")
public class Customer {
    @Id
    private long customerId;
    @Column(nullable = false)
    private String name;

    private String address;

    private String image;

    private String prescription;
}
