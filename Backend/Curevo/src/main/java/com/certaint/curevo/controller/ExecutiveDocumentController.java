package com.certaint.curevo.controller;



import com.certaint.curevo.entity.ExecutiveDocument;
import com.certaint.curevo.service.ExecutiveDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/executive-documents")
@RequiredArgsConstructor
public class ExecutiveDocumentController {

    private final ExecutiveDocumentService service;

    @PostMapping
    public ResponseEntity<ExecutiveDocument> create(@RequestBody ExecutiveDocument document) {
        return ResponseEntity.ok(service.save(document));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExecutiveDocument> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ExecutiveDocument>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
