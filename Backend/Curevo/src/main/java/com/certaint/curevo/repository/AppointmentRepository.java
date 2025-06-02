package com.certaint.curevo.repository;

import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;

public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    @Query("SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.doctor.doctorId = :doctorId " +
            "AND a.appointmentDate = :date " +
            "AND a.appointmentTime = :time " +
            "AND a.status = 'BOOKED'")
    Long countAppointmentsAtTime(Long doctorId, LocalDate date, LocalTime time);
    boolean existsByCustomerCustomerIdAndDoctorDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(
            Long customerId, Long doctorId, LocalDate appointmentDate, LocalTime appointmentTime, AppointmentStatus status);

}
