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
    public DoctorDTO saveDoctor(DoctorDTO doctorDTO, MultipartFile imageFile) {
        // 1. Create and save the User
        User user = new User();
        user.setEmail(doctorDTO.getUser().getEmail());
        user.setPassword(passwordEncoder.encode(doctorDTO.getUser().getPassword()));
        user.setPhone(doctorDTO.getUser().getPhone());
        user.setRole(Role.valueOf(doctorDTO.getUser().getRole()));

        User savedUser = userService.saveUser(user);

        // 2. Create and save the Doctor
        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setName(doctorDTO.getName());
        doctor.setSpecialization(Specialization.valueOf(doctorDTO.getSpecialization()));

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(imageFile, "doctors");
            doctor.setImage(imageUrl);
        }

        Doctor savedDoctor = doctorRepository.save(doctor);

        // 3. Save doctor availabilities
        if (doctorDTO.getAvailabilities() != null) {
            for (DoctorAvailabilityDTO availabilityDTO : doctorDTO.getAvailabilities()) {
                DoctorAvailability availability = new DoctorAvailability();
                availability.setDoctor(savedDoctor);
                availability.setDay(availabilityDTO.getDay());
                availability.setTime(availabilityDTO.getTime());

                availabilityRepository.save(availability);
            }
        }

        // 4. Build and return safe DoctorDTO
        DoctorDTO responseDTO = new DoctorDTO();
        responseDTO.setName(savedDoctor.getName());
        responseDTO.setSpecialization(String.valueOf(savedDoctor.getSpecialization()));
        responseDTO.setImage(savedDoctor.getImage());

        UserDTO responseUserDTO = new UserDTO();
        responseUserDTO.setEmail(savedUser.getEmail());
        responseUserDTO.setPhone(savedUser.getPhone());
        responseUserDTO.setRole(savedUser.getRole().name());

        responseDTO.setUser(responseUserDTO);

        List<DoctorAvailabilityDTO> availabilityDTOs = availabilityRepository.findByDoctor(savedDoctor)
                .stream()
                .map(a -> {
                    DoctorAvailabilityDTO dto = new DoctorAvailabilityDTO();
                    dto.setDay(a.getDay());
                    dto.setTime(a.getTime());
                    return dto;
                })
                .collect(Collectors.toList());

        responseDTO.setAvailabilities(availabilityDTOs);

        return responseDTO;
    }

    public Page<Doctor> getAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable);
    }
    public Page<Doctor> searchDoctors(String keyword, Pageable pageable) {
        return doctorRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }
}
