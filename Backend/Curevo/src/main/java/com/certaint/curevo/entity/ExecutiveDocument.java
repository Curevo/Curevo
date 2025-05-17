package com.certaint.curevo.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "executive_documents")
public class ExecutiveDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "executive_id", nullable = false, unique = true)
    private DeliveryExecutive executive;

    private String aadharNumber;
    private String panNumber;

    private String bankAccountNumber;
    private String bankIFSC;
    private String bankName;

    private Instant submittedAt;
}
