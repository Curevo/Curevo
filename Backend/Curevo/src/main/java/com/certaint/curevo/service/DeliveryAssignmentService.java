package com.certaint.curevo.service;



import com.certaint.curevo.entity.DeliveryAssignment;
import com.certaint.curevo.repository.DeliveryAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class DeliveryAssignmentService {

    private final DeliveryAssignmentRepository repository;

    public DeliveryAssignment save(DeliveryAssignment assignment) {
        assignment.setAssignedAt(Instant.now());
        assignment.setUpdatedAt(Instant.now());
        return repository.save(assignment);
    }

    public Optional<DeliveryAssignment> findById(Long id) {
        return repository.findById(id);
    }

    public List<DeliveryAssignment> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
