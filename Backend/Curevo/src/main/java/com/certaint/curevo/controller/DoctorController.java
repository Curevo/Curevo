package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.enums.Specialization;
import com.certaint.curevo.exception.DoctorNotFoundException;
import com.certaint.curevo.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Doctor>> createDoctor(@RequestPart Doctor doctor, @RequestPart MultipartFile image) {
        Doctor savedDoctor = doctorService.saveDoctor(doctor,image);
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

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctorsList() {
        List<Doctor> doctors = doctorService.getAllDoctorsList();
        return ResponseEntity.ok(new ApiResponse<>(true, "All doctors retrieved successfully", doctors));
    }

    @GetMapping("/specializations")
    public ResponseEntity<ApiResponse<List<String>>> getAllSpecializations() {
        List<String> specializations = doctorService.getAllSpecializationNames();
        return ResponseEntity.ok(new ApiResponse<>(true, "Specializations retrieved successfully", specializations));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctor(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Doctor deleted successfully", "Doctor with ID " + id + " has been removed."));
        } catch (DoctorNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred while deleting the doctor: " + ex.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> updateDoctor(
            @PathVariable Long id,
            @RequestPart Doctor doctor,
            @RequestPart(name = "image", required = false) MultipartFile imageFile) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor, imageFile);
            return ResponseEntity.ok(new ApiResponse<>(true, "Doctor updated successfully", updatedDoctor));
        } catch (DoctorNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to update doctor: " + ex.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable Long id) {
        try {
            Doctor doctor = doctorService.getDoctorById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Doctor retrieved successfully", doctor));
        } catch (DoctorNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to retrieve doctor: " + ex.getMessage(), null));
        }
    }
}