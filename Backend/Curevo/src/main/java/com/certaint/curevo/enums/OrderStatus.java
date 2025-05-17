package com.certaint.curevo.enums;

public enum OrderStatus {
    PENDING,             // Just placed
    NEEDS_VERIFICATION,  // Prescription required
    VERIFIED,            // Prescription verified
    ASSIGNED,            // Delivery executive assigned
    OUT_FOR_DELIVERY,    // En route
    DELIVERED,           // Completed
    CANCELLED            // Cancelled for any reason
}
