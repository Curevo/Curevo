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
        Long doctorId = appointment.getDoctor().getDoctorId(); // Use getDoctorId() as per instruction

        Doctor doctor = doctorService.getDoctorById(doctorId);
        if (doctor == null) {
            throw new EntityNotFoundException("Doctor not found with ID: " + doctorId);
        }
        appointment.setDoctor(doctor); // Attach managed Doctor entity

        Customer customerFromAppointment = appointment.getCustomer();
        if (customerFromAppointment != null && customerFromAppointment.getCustomerId() != null) { // Use getCustomerId()
            Customer managedCustomer = customerService.getCustomerById(customerFromAppointment.getCustomerId()); // Use getCustomerId()
            if (managedCustomer == null) {
                throw new EntityNotFoundException("Authenticated customer not found in database.");
            }
            appointment.setCustomer(managedCustomer); // Set the managed Customer entity back to the appointment
        } else {
            // For non-registered/walk-in users, basic details (name, phone) must be provided
            if (appointment.getName() == null || appointment.getName().trim().isEmpty() ||
                    appointment.getPhone() == null || appointment.getPhone().trim().isEmpty()) {
                throw new IllegalArgumentException("Customer details (name, phone) are required for non-registered bookings.");
            }
            // If no customer ID, customer remains null, and name/age/phone from appointment will be used.
        }



        BigDecimal baseAmount = doctor.getFee();
        if (baseAmount == null) {
            baseAmount = BigDecimal.ZERO;
        }
        appointment.setBaseAmount(baseAmount);


        BigDecimal extraCharge = new BigDecimal("10.00");
        BigDecimal serviceCharge = new BigDecimal("30.00");
        appointment.setExtraCharge(extraCharge);
        appointment.setServiceCharge(serviceCharge);
        appointment.setStatus(AppointmentStatus.PENDING_PAYMENT);


        if (prescriptionFile != null && !prescriptionFile.isEmpty()) {
            String prescriptionImageUrl = imageHostingService.uploadImage(prescriptionFile, "prescriptions");
            appointment.setPrescription(prescriptionImageUrl);
        } else {
            appointment.setPrescription(null);
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Initialize payment with the calculated total amount from the saved appointment
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
    @Transactional
    public Appointment updateAppointment(Long appointmentId, Appointment updatedAppointment) {
        Appointment existingAppointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));

        // Update relevant fields
        existingAppointment.setName(updatedAppointment.getName());
        existingAppointment.setAge(updatedAppointment.getAge());
        existingAppointment.setPhone(updatedAppointment.getPhone());
        existingAppointment.setAppointmentDate(updatedAppointment.getAppointmentDate());
        existingAppointment.setAppointmentTime(updatedAppointment.getAppointmentTime());
        existingAppointment.setStatus(updatedAppointment.getStatus());
        existingAppointment.setBaseAmount(updatedAppointment.getBaseAmount());
        existingAppointment.setServiceCharge(updatedAppointment.getServiceCharge());
        existingAppointment.setExtraCharge(updatedAppointment.getExtraCharge());
        existingAppointment.setPrescription(updatedAppointment.getPrescription());


        existingAppointment.calculateTotalAmount();

        return appointmentRepository.save(existingAppointment);
    }

    public boolean completeAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + id));

        if (appointment.getStatus() != AppointmentStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Appointment cannot be completed unless it is pending payment.");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        return true;
    }

    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Appointment not found with ID: " + id);
        }
        appointmentRepository.deleteById(id);
    }
}