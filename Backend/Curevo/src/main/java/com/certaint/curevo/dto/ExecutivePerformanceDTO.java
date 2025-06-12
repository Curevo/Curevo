package com.certaint.curevo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutivePerformanceDTO {
    private Double averageDeliveryTimeInMinutes; // Or seconds, or whatever unit
    private Long totalOrdersDelivered;
    private Double estimatedTotalEarnings;
    // You can add more fields here if needed, e.g., breakdowns by status
}