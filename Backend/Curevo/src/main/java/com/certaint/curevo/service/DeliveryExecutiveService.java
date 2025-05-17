package com.certaint.curevo.service;

import com.certaint.curevo.entity.DeliveryExecutive;
import com.certaint.curevo.repository.DeliveryExecutiveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeliveryExecutiveService {

    private final DeliveryExecutiveRepository repository;

    public DeliveryExecutive save(DeliveryExecutive executive) {
        return repository.save(executive);
    }

    public Optional<DeliveryExecutive> findById(Long id) {
        return repository.findById(id);
    }

    public List<DeliveryExecutive> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
