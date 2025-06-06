package com.certaint.curevo.dto;

import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.Store;
import com.certaint.curevo.enums.ProductCategory;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductWithDistanceTagDTO {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String image;
    private String hoverImage;
    private String quantity; // This often refers to product unit description (e.g., "50 tablets")
    private Boolean prescriptionRequired;
    private ProductCategory category;
    private Store store;
    private String distanceTag;
    private Integer availableStock; // NEW FIELD for stock quantity

    // Updated constructor to accept stock
    public ProductWithDistanceTagDTO(Product product, String distanceTag, Integer availableStock, Store store) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.image = product.getImage();
        this.hoverImage = product.getHoverImage();
        this.quantity = product.getQuantity();
        this.prescriptionRequired = product.getPrescriptionRequired();
        this.category = product.getCategory();
        this.store = store; // Explicitly set the Store provided as an argument
        this.distanceTag = distanceTag;
        this.availableStock = availableStock;
    }
}
