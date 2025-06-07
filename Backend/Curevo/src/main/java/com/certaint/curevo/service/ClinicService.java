package com.certaint.curevo.service;

import com.certaint.curevo.entity.Clinic;
import com.certaint.curevo.repository.ClinicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClinicService {

    private final ClinicRepository clinicRepository;


    public List<Clinic> getAllClinics() {
        return clinicRepository.findAll();
    }

    public Optional<Clinic> getClinicById(Long id) {
        return clinicRepository.findById(id);
    }

    public Clinic createClinic(Clinic clinic) {
        return clinicRepository.save(clinic);
    }

    public Clinic updateClinic(Long id, Clinic updatedClinic) {
        return clinicRepository.findById(id).map(clinic -> {
            clinic.setName(updatedClinic.getName());
            clinic.setAddress(updatedClinic.getAddress());
            clinic.setLatitude(updatedClinic.getLatitude());
            clinic.setLongitude(updatedClinic.getLongitude());
            clinic.setPhoneNumber(updatedClinic.getPhoneNumber());
            return clinicRepository.save(clinic);
        }).orElseThrow(() -> new RuntimeException("Clinic not found with id " + id));
    }

    public void deleteClinic(Long id) {
        clinicRepository.deleteById(id);
    }
}
