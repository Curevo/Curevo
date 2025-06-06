package com.certaint.curevo.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreDistanceInfo {
    private Long storeId;
    private Double distance;
}