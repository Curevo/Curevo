package com.certaint.curevo.service;

import com.certaint.curevo.dto.DoctorAvailabilityDTO;
import com.certaint.curevo.dto.DoctorDTO;
import com.certaint.curevo.dto.UserDTO;
import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.entity.DoctorAvailability;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.User;
import com.certaint.curevo.enums.Role;
import com.certaint.curevo.enums.Specialization;
import com.certaint.curevo.exception.DoctorNotFoundException;
import com.certaint.curevo.repository.DoctorAvailabilityRepository;
import com.certaint.curevo.repository.DoctorRepository;
import com.certaint.curevo.service.ImageHostingService;
import com.certaint.curevo.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserService userService;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final ImageHostingService imageHostingService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Doctor saveDoctor(Doctor doctor, MultipartFile imageFile) {
        // 1. Encode and save the User
        User user = doctor.getUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userService.saveUser(user);

        // 2. Set saved user to the doctor and save the doctor
        doctor.setUser(savedUser);

        // Handle image upload
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(imageFile, "doctors");
            doctor.setImage(imageUrl);
        }

        // Save doctor
        Doctor savedDoctor = doctorRepository.save(doctor);

        // 3. Save doctor availabilities if present
        if (doctor.getAvailabilities() != null) {
            for (DoctorAvailability availability : doctor.getAvailabilities()) {
                availability.setDoctor(savedDoctor); // Set the doctor for each availability
                availabilityRepository.save(availability);
            }
        }

        return savedDoctor; // Return the saved doctor entity
    }

    public Page<Doctor> getAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable);
    }
    public Page<Doctor> searchDoctors(String keyword, Pageable pageable) {
        return doctorRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + id));
    }
}
