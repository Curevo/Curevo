package com.certaint.curevo.repository;

import com.certaint.curevo.entity.ExecutiveDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutiveDocumentRepository extends JpaRepository<ExecutiveDocument, Long> {
}
