package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.entity.DoctorAvailability;
import com.certaint.curevo.exception.DoctorNotAvailableException;
import com.certaint.curevo.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/doctor/{doctorId}/availability")
    public ResponseEntity<ApiResponse<DoctorAvailability>> checkAvailability(
            @PathVariable Long doctorId,
            @RequestParam String day,
            @RequestParam String time
    ) {
        try {
            LocalTime localTime = LocalTime.parse(time);
            DoctorAvailability availability = appointmentService.getAvailability(doctorId, day.toUpperCase(), localTime);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Availability fetched", availability)
            );

        } catch (DoctorNotAvailableException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Something went wrong", null));
        }
    }
    @PostMapping("/book")
    public ResponseEntity<ApiResponse<Appointment>> bookAppointment(
            @RequestPart ("appointment")Appointment appointment,
            @RequestPart(value = "image",required = false) MultipartFile prescriptionFile
    ) {
        System.out.println("Appointment object: " + appointment.getCustomer().getCustomerId());
        System.out.println("Appointment object: " + appointment.getDoctor().getDoctorId());
        if (prescriptionFile != null) {
            System.out.println("Received file: " + prescriptionFile.getOriginalFilename());
        } else {
            System.out.println("No file received.");
        }
        if (appointment.getCustomer() != null) {
            System.out.println("Customer: " + appointment.getCustomer());
            System.out.println("Appointment object: " + appointment.getCustomer().getCustomerId());
        } else {
            System.out.println("No Customer");
        }
        try {
            Appointment bookedAppointment = appointmentService.bookAppointment(appointment, prescriptionFile);
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment booked successfully", bookedAppointment));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Something went wrong: " + ex.getMessage(), null));
        }
    }
    @GetMapping("/all")
    public ApiResponse<List<Appointment>> getALlAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return new ApiResponse<>(true, "Appointments retrieved successfully", appointments);
    }
}