package com.certaint.curevo.service;

import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.entity.Order;
import com.certaint.curevo.entity.Payment;
import com.certaint.curevo.enums.PaymentStatus;
import com.certaint.curevo.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime; // Still needed for createdAt/updatedAt
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }


    @Transactional
    public Payment createPayment(Payment payment) {
        if (payment.getAmount() == null || payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive.");
        }
        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.PENDING); // Default to PENDING if not explicitly set
        }
        // createdAt and updatedAt are handled by @PrePersist
        return paymentRepository.save(payment);
    }


    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }


    public List<Payment> getPaymentsByAppointmentId(Long appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId);
    }


    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }


    @Transactional
    public Payment updatePayment(Payment updatedPayment) {
        if (updatedPayment.getId() == null) {
            throw new IllegalArgumentException("Payment ID cannot be null for update operation.");
        }
        Payment existingPayment = paymentRepository.findById(updatedPayment.getId())
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + updatedPayment.getId()));

        existingPayment.setAmount(updatedPayment.getAmount());
        existingPayment.setStatus(updatedPayment.getStatus());
        existingPayment.setMethod(updatedPayment.getMethod());


        return paymentRepository.save(existingPayment);
    }


    @Transactional
    public Payment updatePaymentStatus(Long paymentId, PaymentStatus newStatus) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + paymentId));

        payment.setStatus(newStatus);

        return paymentRepository.save(payment);
    }


    @Transactional
    public void deletePayment(Long paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new EntityNotFoundException("Payment not found with ID: " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }

    @Transactional
    public Payment initializePaymentForAppointment(Appointment appointment, BigDecimal amount) {
        Payment payment = new Payment();
        payment.setAppointment(appointment);
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setMethod("N/A"); // Method will be set upon actual payment
        return createPayment(payment);
    }

    @Transactional
    public Payment initializePaymentForOrder(Order order, BigDecimal amount) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setMethod("N/A");
        return createPayment(payment);
    }
}