package com.certaint.curevo.service;

import com.certaint.curevo.entity.Appointment;
import com.certaint.curevo.entity.Order;
import com.certaint.curevo.entity.Payment;
import com.certaint.curevo.enums.AppointmentStatus;
import com.certaint.curevo.enums.PaymentStatus;
import com.certaint.curevo.repository.AppointmentRepository;
import com.certaint.curevo.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;


    @Transactional
    public Payment createPayment(Payment payment) {
        if (payment.getAmount() == null || payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive.");
        }
        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.PENDING);
        }
        return paymentRepository.save(payment);
    }


    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }


    public Payment getPaymentsByAppointmentId(Long appointmentId) {
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

    @Transactional
    public Payment updatePayment(Long paymentId, Payment updatedPayment) {
        Payment existingPayment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + paymentId));

        existingPayment.setAmount(updatedPayment.getAmount());
        existingPayment.setStatus(updatedPayment.getStatus());
        existingPayment.setMethod(updatedPayment.getMethod());
        existingPayment.setAppointment(updatedPayment.getAppointment());
        existingPayment.setOrder(updatedPayment.getOrder());

        return paymentRepository.save(existingPayment);
    }


    // Assume appointmentService.getAppointmentByIdAndCustomer returns a valid Appointment object
    public Payment processPayment(Appointment appointment) {
        // Use findByAppointmentId from your repository
        Optional<Payment> paymentOpt = paymentRepository.findByAppointment(appointment);


        if (paymentOpt.isEmpty()) { // Use isPresent() or isEmpty() with Optional
            throw new EntityNotFoundException("Payment not found for appointment ID: " + appointment.getId());
        }
        Payment payment = paymentOpt.get(); // Get the Payment object from the Optional

        if (payment.getStatus() != PaymentStatus.PENDING || appointment.getStatus() != AppointmentStatus.PENDING_PAYMENT) {
            // Note: I've changed '&&' to '||' here, assuming both conditions must be met to proceed,
            // and if either is not met, it's an illegal state. Adjust based on your exact logic.
            throw new IllegalStateException("Payment or Appointment is not in a processable state. Payment Status: " + payment.getStatus() + ", Appointment Status: " + appointment.getStatus());
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setMethod("ONLINE");
        appointment.setStatus(AppointmentStatus.BOOKED);

        appointmentRepository.save(appointment);
        // Assuming updatePayment calls paymentRepository.save(payment) internally, this is fine
        return updatePayment(payment.getId(), payment);
    }

    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }
}