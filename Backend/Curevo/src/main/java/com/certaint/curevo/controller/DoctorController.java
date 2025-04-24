package com.certaint.curevo.controller;

import com.certaint.curevo.dto.DoctorDTO;
import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<DoctorDTO> createDoctor(@RequestPart DoctorDTO doctor, @RequestPart MultipartFile image) {
        DoctorDTO savedDoctor = doctorService.saveDoctor(doctor,image);
        return ResponseEntity.ok(savedDoctor);
    }


//    @GetMapping("/all")
//    public ResponseEntity<List<Doctor>> getAllDoctors() {
//        List<Doctor> doctors = doctorService.getAllDoctors();
//        return ResponseEntity.ok(doctors);
//    }
//

//    @GetMapping("/view/{id}")
//    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
//        Optional<Doctor> doctor = doctorService.getDoctorById(id);
//        return doctor.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//

//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
//        doctorService.deleteDoctor(id);
//        return ResponseEntity.noContent().build();
//    }
}
