package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.security.JwtService;
import com.certaint.curevo.service.AppointmentService;
import com.certaint.curevo.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtService jwtService;
    private final CustomerService customerService;

    @GetMapping("/doctor/{doctorId}/availability")
    public ResponseEntity<ApiResponse<List<LocalTime>>> checkAvailability(
            @PathVariable Long doctorId,
            @RequestParam LocalDate date
    ) {
        try {
            List<LocalTime> availableSlots = appointmentService.getAvailableSlots(doctorId, date);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Availability fetched successfully", availableSlots)
            );

        } catch (Exception ex) {
            // It's good practice to log the full stack trace on the server side
            System.err.println("Error checking availability: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Something went wrong: " + ex.getMessage(), null));
        }
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<Appointment>> bookAppointment(
            @RequestPart("appointment") Appointment appointment,
            @RequestPart(value = "image", required = false) MultipartFile prescriptionFile,
            @RequestHeader("Authorization") String authHeader
    ) {
        if (prescriptionFile != null) {
            System.out.println("Received file: " + prescriptionFile.getOriginalFilename());
        } else {
            System.out.println("No file received.");
        }

        try {
            if (!authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Authorization token must start with Bearer.", null));
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
            appointment.setCustomer(customer); // Set the full Customer object from DB

            // FIX: Use customer.getId() if your Customer entity's ID field is 'id'
            System.out.println("Customer from JWT: " + customer.getName() + " (ID: " + customer.getCustomerId() + ")");
            System.out.println("Appointment object's customer: " + (appointment.getCustomer() != null ? appointment.getCustomer().getCustomerId() : "null"));

            Appointment bookedAppointment = appointmentService.bookAppointment(appointment, prescriptionFile);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment booked successfully", bookedAppointment));
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            System.err.println("JWT Expired: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Authentication token expired. Please log in again.", null));
        } catch (io.jsonwebtoken.MalformedJwtException ex) {
            System.err.println("JWT Malformed: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid authentication token. Please log in again.", null));
        } catch (Exception ex) {
            // Always log the full stack trace for unexpected errors
            System.err.println("Error booking appointment: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Something went wrong: " + ex.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ApiResponse<List<Appointment>> getALlAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return new ApiResponse<>(true, "Appointments retrieved successfully", appointments);
    }

    @GetMapping("/me")
    public ApiResponse<List<Appointment>> getMyAppointments(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            if (!authHeader.startsWith("Bearer ")) {
                return new ApiResponse<>(false, "Authorization token must start with Bearer.", null);
            }

            String jwt = authHeader.substring(7);
            String customerEmail = jwtService.extractEmail(jwt);

            if (customerEmail == null) {
                return new ApiResponse<>(false, "Could not extract email from token.", null);
            }

            Optional<Customer> customerOptional = customerService.getByEmail(customerEmail);

            if (customerOptional.isEmpty()) {
                return new ApiResponse<>(false, "Authenticated customer not found.", null);
            }

            Customer customer = customerOptional.get();
            List<Appointment> appointments = appointmentService.getAppointmentsByCustomer(customer);

            return new ApiResponse<>(true, "My appointments retrieved successfully", appointments);
        } catch (Exception ex) {
            System.err.println("Error getting my appointments: " + ex.getMessage());
            ex.printStackTrace();
            return new ApiResponse<>(false, "Something went wrong: " + ex.getMessage(), null);
        }
    }

    @GetMapping("/get-appointment/{id}")
    public ApiResponse<Appointment> getAppointmentById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader){

        try {
            if (!authHeader.startsWith("Bearer ")) {
                return new ApiResponse<>(false, "Authorization token must start with Bearer.", null);
            }

            String jwt = authHeader.substring(7);
            String customerEmail = jwtService.extractEmail(jwt);

            if (customerEmail == null) {
                return new ApiResponse<>(false, "Could not extract email from token.", null);
            }

            Optional<Customer> customerOptional = customerService.getByEmail(customerEmail);

            if (customerOptional.isEmpty()) {
                return new ApiResponse<>(false, "Authenticated customer not found.", null);
            }

            Customer customer = customerOptional.get();
            Appointment appointment = appointmentService.getAppointmentByIdAndCustomer(id,customer);

            return new ApiResponse<>(true, "My appointments retrieved successfully", appointment);
        } catch (Exception ex) {
            System.err.println("Error getting appointment by ID: " + ex.getMessage());
            ex.printStackTrace();
            return new ApiResponse<>(false, "Something went wrong: " + ex.getMessage(), null);
        }
    }
}