package com.certaint.curevo.controller;

import com.certaint.curevo.entity.DeliveryAssignment;
import com.certaint.curevo.service.DeliveryAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class DeliveryAssignmentController {

    private final DeliveryAssignmentService service;

    @PostMapping
    public ResponseEntity<DeliveryAssignment> create(@RequestBody DeliveryAssignment assignment) {
        return ResponseEntity.ok(service.save(assignment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryAssignment> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DeliveryAssignment>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
