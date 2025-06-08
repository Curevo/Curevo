package com.certaint.curevo.enums; // Or com.certaint.curevo.enums;

public enum PaymentStatus {
    PENDING("Pending"),
    SUCCESS("Success"),
    FAILED("Failed"),
    REFUNDED("Refunded"),
    CANCELLED("Cancelled"); // Could be for a payment intent that was cancelled before completion

    private final String displayValue;

    PaymentStatus(String displayValue) {
        this.displayValue = displayValue;
    }

    public String getDisplayValue() {
        return displayValue;
    }
}