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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
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
        User user = doctor.getUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.valueOf("DOCTOR"));

        User savedUser = userService.saveUser(user);

        doctor.setUser(savedUser);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(imageFile, "doctors");
            doctor.setImage(imageUrl);
        }

        Doctor savedDoctor = doctorRepository.save(doctor);

        if (doctor.getAvailabilities() != null) {
            for (DoctorAvailability availability : doctor.getAvailabilities()) {
                availability.setDoctor(savedDoctor);
                availabilityRepository.save(availability);
            }
        }

        return savedDoctor;
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

    @Transactional
    public Doctor updateDoctor(Long doctorId, Doctor updatedDoctor, MultipartFile imageFile) {
        Doctor existingDoctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + doctorId));

        // Get the current image URL from the database, this will be preserved if no new image is provided
        String oldImageUrl = existingDoctor.getImage();

        existingDoctor.setName(updatedDoctor.getName());
        existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
        existingDoctor.setQualification(updatedDoctor.getQualification());

        // --- Simplified Image Handling Logic: Only act if a new image file is provided ---
        if (imageFile != null && !imageFile.isEmpty()) {
            // A new image file is provided.
            // First, delete the old image if it exists.
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                imageHostingService.deleteImage(oldImageUrl);
            }
            String newImageUrl = imageHostingService.uploadImage(imageFile, "doctors");
            existingDoctor.setImage(newImageUrl);
        }


        if (updatedDoctor.getUser() != null) {
            User existingUser = existingDoctor.getUser();
            User updatedUser = updatedDoctor.getUser();

            if (existingUser == null) {
                updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                User savedUser = userService.saveUser(updatedUser);
                existingDoctor.setUser(savedUser);
            } else {
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setPhone(updatedUser.getPhone());
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    if (!passwordEncoder.matches(updatedUser.getPassword(), existingUser.getPassword())) {
                        existingUser.setPassword(passwordEncoder.encode(existingUser.getPassword()));
                    }
                }
                userService.saveUser(existingUser);
            }
        }

        if (updatedDoctor.getClinic() != null && updatedDoctor.getClinic().getClinicId() != null) {
            existingDoctor.setClinic(updatedDoctor.getClinic());
        } else {
            existingDoctor.setClinic(null);
        }

        if (updatedDoctor.getAvailabilities() != null) {
            existingDoctor.getAvailabilities().clear();

            for (DoctorAvailability newAvailability : updatedDoctor.getAvailabilities()) {
                newAvailability.setDoctor(existingDoctor);
                existingDoctor.getAvailabilities().add(newAvailability);
            }
        } else {
            existingDoctor.getAvailabilities().clear();
        }

        return doctorRepository.save(existingDoctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctorToDelete = doctorRepository.findById(id)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + id));

        // Delete associated image from Cloudinary
        if (doctorToDelete.getImage() != null && !doctorToDelete.getImage().isEmpty()) {
            imageHostingService.deleteImage(doctorToDelete.getImage());
        }
        doctorRepository.deleteById(id);
    }

    public List<Doctor> getAllDoctorsList() {
        return doctorRepository.findAll();
    }

    public List<String> getAllSpecializationNames() {
        return Arrays.stream(Specialization.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}