package com.certaint.curevo.service;

import com.certaint.curevo.entity.ExecutiveDocument;
import com.certaint.curevo.repository.ExecutiveDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class ExecutiveDocumentService {

    private final ExecutiveDocumentRepository repository;

    public ExecutiveDocument save(ExecutiveDocument document) {
        return repository.save(document);
    }

    public Optional<ExecutiveDocument> findById(Long id) {
        return repository.findById(id);
    }

    public List<ExecutiveDocument> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
