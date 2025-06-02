package com.certaint.curevo.service;

import com.certaint.curevo.entity.*;
import com.certaint.curevo.enums.AppointmentStatus;
import com.certaint.curevo.repository.AppointmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final DoctorAvailabilityService doctorAvailabilityService;
    private final ImageHostingService imageHostingService;
    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;
    private final CustomerService customerService;

    public DoctorAvailability getAvailability(Long doctorId, String requestedDay, LocalTime requestedTime) {

        DoctorAvailability availability = doctorAvailabilityService.getAvailabilityForSlot(
                doctorId,
                requestedDay,
                requestedTime
        );

        return availability;
    }


    @Transactional
    public Appointment bookAppointment(Appointment appointment, MultipartFile prescriptionFile) {
        Long customerId = appointment.getCustomer().getCustomerId();
        Long doctorId = appointment.getDoctor().getDoctorId();
        LocalDate date = appointment.getAppointmentDate();
        LocalTime time = appointment.getAppointmentTime();
        boolean exists = appointmentRepository.existsByCustomerCustomerIdAndDoctorDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(
                customerId, doctorId, date, time, AppointmentStatus.BOOKED
        );

        if (exists) {
            throw new IllegalStateException("You already have an appointment booked for this time slot.");
        }
        // Fetch and attach managed Doctor entity
        Doctor doctor = doctorService.getDoctorById(doctorId);;
        System.out.println("Doctor: " + doctor);
        appointment.setDoctor(doctor);


        // Fetch and attach managed User entity
        Customer customer = customerService.getCustomerById(customerId);
        System.out.println("Customer: " + customer);
        appointment.setCustomer(customer);


        // Upload prescription image if present
        if (prescriptionFile != null && !prescriptionFile.isEmpty()) {
            String prescriptionImageUrl = imageHostingService.uploadImage(prescriptionFile, "prescriptions");
            appointment.setPrescription(prescriptionImageUrl);
        } else {
            appointment.setPrescription(null);
        }

        // Save appointment to DB
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments()
    {
        return appointmentRepository.findAll();
    }


}
