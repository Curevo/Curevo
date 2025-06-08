package com.certaint.curevo.repository;

import com.certaint.curevo.entity.Payment;
import com.certaint.curevo.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {


    List<Payment> findByAppointmentId(Long appointmentId);

    List<Payment> findByOrderId(Long orderId);

    List<Payment> findByStatus(PaymentStatus status);

    Optional<Payment> findByIdAndAppointmentId(Long paymentId, Long appointmentId);

    Optional<Payment> findByIdAndOrderId(Long paymentId, Long orderId);

}