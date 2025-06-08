package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Payment;
import com.certaint.curevo.service.AppointmentService;
import com.certaint.curevo.service.CustomerService;
import com.certaint.curevo.security.JwtService;
import com.certaint.curevo.service.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {


    private final PaymentService paymentService;


    private final AppointmentService appointmentService; // Needed to link payments to appointments


    private final JwtService jwtService; // For user authentication/authorization


    private final CustomerService customerService; // For getting customer from email

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByAppointmentId(
            @PathVariable Long appointmentId,
            HttpServletRequest httpRequest) { // Using HttpServletRequest to get header

        // 1. Authenticate and get customer
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Authorization token is missing or invalid.", null));
        }

        String jwt = authHeader.substring(7);
        String customerEmail = jwtService.extractEmail(jwt);

        if (customerEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Could not extract email from token.", null));
        }

        Optional<Customer> customerOptional = customerService.getByEmail(customerEmail);
        if (customerOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Authenticated customer not found.", null));
        }
        Customer customer = customerOptional.get();

        try {

            Appointment appointment = appointmentService.getAppointmentByIdAndCustomer(appointmentId, customer);


            List<Payment> payments = paymentService.getPaymentsByAppointmentId(appointment.getId());

            return ResponseEntity.ok(new ApiResponse<>(true, "Payments for appointment retrieved successfully.", payments));
        } catch (EntityNotFoundException e) {
            // This exception is thrown if the appointment is not found or does not belong to the customer
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            // Catch any other unexpected errors
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected error occurred: " + e.getMessage(), null));
        }
    }


    private Optional<Customer> getAuthenticatedCustomer(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }

        String jwt = authHeader.substring(7);
        String customerEmail = jwtService.extractEmail(jwt);

        if (customerEmail == null) {
            return Optional.empty();
        }
        return customerService.getByEmail(customerEmail);
    }
}