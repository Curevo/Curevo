package com.certaint.curevo.service;

import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.entity.DoctorAvailability;
import com.certaint.curevo.enums.AppointmentStatus;
import com.certaint.curevo.exception.DoctorNotAvailableException;
import com.certaint.curevo.exception.DoctorNotFoundException;
import com.certaint.curevo.repository.AppointmentRepository;
import com.certaint.curevo.repository.DoctorAvailabilityRepository;
import com.certaint.curevo.repository.DoctorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {
    private final DoctorAvailabilityRepository doctorAvailabilityRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorAvailability getAvailabilityForSlot(Long doctorId, String dayOfWeek, LocalTime time) {

        Optional<DoctorAvailability> optionalAvailability = doctorAvailabilityRepository
                .findByDoctorDoctorIdAndDayAndTime(doctorId, dayOfWeek, time);

        if (optionalAvailability.isPresent()) {
            return optionalAvailability.get();
        } else {
            throw new DoctorNotAvailableException("Doctor is not available on " + dayOfWeek + " at " + time);
        }
    }
    public List<DoctorAvailability> getAvailabilityByDoctorId(Long doctorId) {
        return doctorAvailabilityRepository.findByDoctorDoctorId(doctorId);
    }

    public DoctorAvailability addAvailability(Long doctorId, DoctorAvailability availability) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found"));
        availability.setDoctor(doctor);
        return doctorAvailabilityRepository.save(availability);
    }

    public List<LocalTime> getAvailableSlotsForDoctorAndDate(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));

        String dayOfWeek = date.getDayOfWeek().name();

        List<DoctorAvailability> doctorScheduledAvailabilities = doctorAvailabilityRepository.findByDoctorAndDay(doctor, dayOfWeek);

        if (doctorScheduledAvailabilities.isEmpty()) {
            return List.of(); // No scheduled availability for this doctor on this day
        }

        List<LocalTime> potentialSlots = doctorScheduledAvailabilities.stream()
                .map(DoctorAvailability::getTime)
                .sorted()
                .collect(Collectors.toList());

        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorAndAppointmentDateAndStatusIn(
                doctor, date, List.of(AppointmentStatus.PENDING_PAYMENT, AppointmentStatus.BOOKED, AppointmentStatus.COMPLETED)
        );

        return potentialSlots.stream()
                .filter(slot -> {
                    long bookingsInThisSlot = bookedAppointments.stream()
                            .filter(app -> app.getAppointmentTime().equals(slot))
                            .count();

                    DoctorAvailability slotAvailability = doctorScheduledAvailabilities.stream()
                            .filter(da -> da.getTime().equals(slot))
                            .findFirst()
                            .orElse(null); // Should always find if slot is in potentialSlots

                    if (slotAvailability != null && slotAvailability.getMaxAppointments() != null) {
                        return bookingsInThisSlot < slotAvailability.getMaxAppointments();
                    }
                    // If maxAppointments is not defined or 0, assume 1 as default and only allow if no bookings
                    return bookingsInThisSlot == 0;
                })
                .filter(slot -> {
                    // Filter out past slots for the current day
                    if (date.isEqual(LocalDate.now())) {
                        return slot.isAfter(LocalTime.now());
                    }
                    return true; // Slots are always available for future dates
                })
                .collect(Collectors.toList());
    }




}
