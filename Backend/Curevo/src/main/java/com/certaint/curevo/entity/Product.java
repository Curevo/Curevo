package com.certaint.curevo.entity;


import com.certaint.curevo.enums.ProductCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


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

}
