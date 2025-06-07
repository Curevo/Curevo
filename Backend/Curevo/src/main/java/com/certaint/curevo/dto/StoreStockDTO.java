package com.certaint.curevo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreStockDTO {
    private Long storeId;
    private String storeName; // To display the store's name
    private Integer stock;
}