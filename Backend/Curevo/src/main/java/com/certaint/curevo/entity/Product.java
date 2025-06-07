package com.certaint.curevo.entity;


import com.certaint.curevo.enums.ProductCategory;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String name;

    @Column(length = 1000)
    private String description;

    private BigDecimal price;

    private String image;

    private String hoverImage;

    private String quantity;

    @Column(nullable = false)
    private Boolean prescriptionRequired;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Inventory> inventories = new ArrayList<>(); // Initialize the list






}
