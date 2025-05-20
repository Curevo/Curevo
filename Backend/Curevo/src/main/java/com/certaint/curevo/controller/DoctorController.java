package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.dto.DoctorDTO;
import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.service.DoctorService;
import com.cloudinary.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors") // Base URL for all doctor-related APIs
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // Create a new doctor
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<DoctorDTO>> createDoctor(@RequestPart DoctorDTO doctor, @RequestPart MultipartFile image) {
        DoctorDTO savedDoctor = doctorService.saveDoctor(doctor,image);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor saved successfully", savedDoctor));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Doctor>>> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Doctor> doctors = doctorService.getAllDoctors(pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors retrieved successfully", doctors));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Doctor>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Doctor> results = doctorService.searchDoctors(keyword, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Search completed successfully", results));
    }


}
