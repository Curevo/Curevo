package com.certaint.curevo.enums;

public enum DeliveryExecutiveStatus {
    AVAILABLE,//This is for when the user starts his day
    UNAVAILABLE,//This is for when the user wants to accept no more orders
    MANUALLY_UNAVAILABLE,
    INACTIVE,//This is for when the user wants to end his day
    NOT_VERIFIED,//This is for when the user has not completed the verification process
}