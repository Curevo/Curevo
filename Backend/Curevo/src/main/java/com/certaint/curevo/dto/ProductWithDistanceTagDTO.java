package com.certaint.curevo.dto;

import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.Store;
import com.certaint.curevo.enums.ProductCategory;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductWithDistanceTagDTO {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String image;
    private String hoverImage;
    private String quantity;
    private Boolean prescriptionRequired;
    private ProductCategory category;
    private Store store;
    private String distanceTag;

    // Explicit constructor to map Product and distanceTag into this DTO
    public ProductWithDistanceTagDTO(Product product, String distanceTag) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.image = product.getImage();
        this.hoverImage = product.getHoverImage();
        this.quantity = product.getQuantity();
        this.prescriptionRequired = product.getPrescriptionRequired();
        this.category = product.getCategory();
        this.store = product.getStore();
        this.distanceTag = distanceTag;
    }

    // Default no-arg constructor if needed (optional)
    public ProductWithDistanceTagDTO() {}
}
