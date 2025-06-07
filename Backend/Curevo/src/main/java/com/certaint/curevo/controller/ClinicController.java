package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Clinic;
import com.certaint.curevo.service.ClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinics")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;


    @GetMapping
    public ResponseEntity<ApiResponse<List<Clinic>>> getAllClinics() {
        List<Clinic> clinics = clinicService.getAllClinics();
        return ResponseEntity.ok(new ApiResponse<>(true, "Clinics fetched successfully", clinics));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Clinic>> getClinicById(@PathVariable Long id) {
        return clinicService.getClinicById(id)
                .map(clinic -> ResponseEntity.ok(new ApiResponse<>(true, "Clinic fetched successfully", clinic)))
                .orElseGet(() -> ResponseEntity.status(404).body(new ApiResponse<>(false, "Clinic not found", null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Clinic>> createClinic(@RequestBody Clinic clinic) {
        Clinic savedClinic = clinicService.createClinic(clinic);
        return ResponseEntity.ok(new ApiResponse<>(true, "Clinic created successfully", savedClinic));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Clinic>> updateClinic(@PathVariable Long id, @RequestBody Clinic clinic) {
        try {
            Clinic updatedClinic = clinicService.updateClinic(id, clinic);
            return ResponseEntity.ok(new ApiResponse<>(true, "Clinic updated successfully", updatedClinic));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClinic(@PathVariable Long id) {
        clinicService.deleteClinic(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Clinic deleted successfully", null));
    }
}
