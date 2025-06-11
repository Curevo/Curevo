package com.certaint.curevo.repository;

import com.certaint.curevo.entity.DeliveryExecutive;
import com.certaint.curevo.entity.ExecutiveDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExecutiveDocumentRepository extends JpaRepository<ExecutiveDocument, Long> {
    Optional<Object> findByExecutive(DeliveryExecutive executive);
}
