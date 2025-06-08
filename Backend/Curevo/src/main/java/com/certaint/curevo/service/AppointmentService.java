package com.certaint.curevo.service;

import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.enums.AppointmentStatus;
import com.certaint.curevo.repository.AppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
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
    private final PaymentService paymentService;

    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate requestedDate) {
        return doctorAvailabilityService.getAvailableSlotsForDoctorAndDate(doctorId, requestedDate);
    }

    public List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date) {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        if (doctor == null) {
            throw new EntityNotFoundException("Doctor not found with ID: " + doctorId);
        }
        return appointmentRepository.findByDoctorAndAppointmentDate(doctor, date);
    }

    @Transactional
    public Appointment bookAppointment(Appointment appointment, MultipartFile prescriptionFile) {
        Long doctorId = appointment.getDoctor().getDoctorId();
        LocalDate date = appointment.getAppointmentDate();
        LocalTime time = appointment.getAppointmentTime();

        Doctor doctor = doctorService.getDoctorById(doctorId);
        if (doctor == null) {
            throw new EntityNotFoundException("Doctor not found with ID: " + doctorId);
        }
        appointment.setDoctor(doctor);

        Customer customer = null;
        if (appointment.getCustomer() != null && appointment.getCustomer().getCustomerId() != null) {
            customer = customerService.getCustomerById(appointment.getCustomer().getCustomerId());
            if (customer == null) {
                throw new EntityNotFoundException("Customer not found with ID: " + appointment.getCustomer().getCustomerId());
            }
            appointment.setCustomer(customer);
        } else {
            if (appointment.getName() == null || appointment.getName().trim().isEmpty() ||
                    appointment.getPhone() == null || appointment.getPhone().trim().isEmpty()) {
                throw new IllegalArgumentException("Customer details (name, phone) are required for non-registered bookings.");
            }
        }

        List<LocalTime> availableSlots = doctorAvailabilityService.getAvailableSlotsForDoctorAndDate(doctorId, date);
        if (!availableSlots.contains(time)) {
            throw new IllegalArgumentException("Requested appointment time " + time + " is not available for doctor " + doctor.getName() + " on " + date);
        }

        boolean exists = appointmentRepository.existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusIn(
                doctor,
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                List.of(AppointmentStatus.PENDING_PAYMENT, AppointmentStatus.BOOKED, AppointmentStatus.COMPLETED)
        );

        if (exists) {
            throw new IllegalStateException("This time slot is no longer available.");
        }

        appointment.setStatus(AppointmentStatus.PENDING_PAYMENT);

        BigDecimal baseAmount = doctor.getFee();
        if (baseAmount == null) {
            baseAmount = BigDecimal.ZERO;
        }
        appointment.setBaseAmount(baseAmount);

        // REMOVED: serviceCharge is not present in Appointment entity
        // BigDecimal serviceCharge = new BigDecimal("50.00");

        BigDecimal extraCharge = new BigDecimal("25.00");
        appointment.setExtraCharge(extraCharge);

        // Note: totalAmount calculation now occurs within the Appointment entity via @PrePersist/@PreUpdate.
        // That method in Appointment.java MUST be updated to remove the reference to 'serviceCharge'.

        if (prescriptionFile != null && !prescriptionFile.isEmpty()) {
            String prescriptionImageUrl = imageHostingService.uploadImage(prescriptionFile, "prescriptions");
            appointment.setPrescription(prescriptionImageUrl);
        } else {
            appointment.setPrescription(null);
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);

        paymentService.initializePaymentForAppointment(savedAppointment, savedAppointment.getTotalAmount());

        return savedAppointment;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByCustomer(Customer customer) {
        return appointmentRepository.findByCustomer(customer);
    }

    public Appointment getAppointmentByIdAndCustomer(Long appointmentId, Customer customer) {
        return appointmentRepository.getAppointmentByIdAndCustomer(appointmentId, customer);
    }

    public Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }
}