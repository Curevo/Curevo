package com.certaint.curevo.repository;

import com.certaint.curevo.entity.DeliveryExecutive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryExecutiveRepository extends JpaRepository<DeliveryExecutive, Long> {
}
