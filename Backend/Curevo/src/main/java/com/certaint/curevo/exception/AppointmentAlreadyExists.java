package com.certaint.curevo.exception;

public class AppointmentAlreadyExists extends RuntimeException {
    public AppointmentAlreadyExists(String message) {
        super(message);
    }
}
