package com.certaint.curevo.controller;


import com.certaint.curevo.entity.DeliveryExecutive;
import com.certaint.curevo.service.DeliveryExecutiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/executives")
@RequiredArgsConstructor
public class DeliveryExecutiveController {

    private final DeliveryExecutiveService service;

    @PostMapping
    public ResponseEntity<DeliveryExecutive> create(@RequestBody DeliveryExecutive executive) {
        return ResponseEntity.ok(service.save(executive));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryExecutive> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DeliveryExecutive>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
