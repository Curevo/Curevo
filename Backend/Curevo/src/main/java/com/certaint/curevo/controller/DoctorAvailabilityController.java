package com.certaint.curevo.controller;


import com.certaint.curevo.entity.DoctorAvailability;
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.service.DoctorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/doctors")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService doctorAvailabilityService;


    @GetMapping("/availability/{doctorId}")
    public ResponseEntity<ApiResponse<List<DoctorAvailability>>> getAvailabilityByDoctor(@PathVariable Long doctorId) {
        List<DoctorAvailability> availabilityList = doctorAvailabilityService.getAvailabilityByDoctorId(doctorId);

        if (availabilityList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "No availability found for this doctor", null));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor availability retrieved", availabilityList));
    }

    @PostMapping("/availability/{doctorId}")
    public ResponseEntity<ApiResponse<DoctorAvailability>> addAvailability(
            @PathVariable Long doctorId,
            @RequestBody DoctorAvailability availability
    ) {
        DoctorAvailability savedAvailability = doctorAvailabilityService.addAvailability(doctorId, availability);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Availability added", savedAvailability));
    }
}

