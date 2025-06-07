package com.certaint.curevo.dto;

import com.certaint.curevo.enums.ProductCategory; // Make sure your ProductCategory enum is imported
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductWithInventoryDTO {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String image;
    private String hoverImage;
    private String quantity; // Matches your entity's String type for 'quantity'
    private Boolean prescriptionRequired;
    private ProductCategory category;

    // This list holds the stock details for this product in various stores
    private List<StoreStockDTO> inventoryDetails;
}