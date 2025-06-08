package com.certaint.curevo.repository;

import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctorDoctorId(Long doctorId);

    List<DoctorAvailability> findByDoctor(Doctor doctor);

    Optional<DoctorAvailability> findByDoctorDoctorIdAndDayAndTime(Long doctorId, String day, LocalTime time);

    List<DoctorAvailability> findByDoctorAndDay(Doctor doctor, String day);

    Optional<DoctorAvailability> findByDoctorAndDayAndTime(Doctor doctor, String day, java.time.LocalTime time);
}

