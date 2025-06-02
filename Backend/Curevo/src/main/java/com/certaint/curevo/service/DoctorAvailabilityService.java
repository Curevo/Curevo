package com.certaint.curevo.service;

import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.entity.DoctorAvailability;
import com.certaint.curevo.exception.DoctorNotAvailableException;
import com.certaint.curevo.exception.DoctorNotFoundException;
import com.certaint.curevo.repository.DoctorAvailabilityRepository;
import com.certaint.curevo.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {
    private final DoctorAvailabilityRepository doctorAvailabilityRepository;
    private final DoctorRepository doctorRepository;
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




}
