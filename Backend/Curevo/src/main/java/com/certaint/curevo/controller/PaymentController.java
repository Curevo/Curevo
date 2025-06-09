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


    private final AppointmentService appointmentService;


    private final JwtService jwtService;


    private final CustomerService customerService;

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentsByAppointmentId(
            @PathVariable Long appointmentId,
            @RequestHeader("Authorization") String authHeader) { // Using HttpServletRequest to get header


        Customer customer = getAuthenticatedCustomer(authHeader).get();

        try {

            Appointment appointment = appointmentService.getAppointmentByIdAndCustomer(appointmentId, customer);


            Payment payment = paymentService.getPaymentsByAppointmentId(appointment.getId());

            return ResponseEntity.ok(new ApiResponse<>(true, "Payments for appointment retrieved successfully.", payment));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected error occurred: " + e.getMessage(), null));
        }
    }

    @PostMapping("process/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<Payment>> processPaymentForAppointment(
            @PathVariable Long appointmentId,
            @RequestHeader("Authorization") String authHeader) {

        Optional<Customer> customerOpt = getAuthenticatedCustomer(authHeader);

        if (customerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Unauthorized: Customer not found", null));
        }

        Customer customer = customerOpt.get();

        try {
            Appointment appointment = appointmentService.getAppointmentByIdAndCustomer(appointmentId, customer);

            Payment payment = paymentService.processPayment(appointment);

            return ResponseEntity.ok(new ApiResponse<>(true, "Payment processed successfully.", payment));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected error occurred: " + e.getMessage(), null));
        }
    }



    private Optional<Customer> getAuthenticatedCustomer(String authHeader) {

        String jwt = authHeader.substring(7);
        String customerEmail = jwtService.extractEmail(jwt);

        if (customerEmail == null) {
            return Optional.empty();
        }
        return customerService.getByEmail(customerEmail);
    }
}