package com.certaint.curevo.repository;

import com.certaint.curevo.entity.DeliveryExecutive;
import com.certaint.curevo.enums.DeliveryExecutiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryExecutiveRepository extends JpaRepository<DeliveryExecutive, Long> {
    Optional<DeliveryExecutive> findFirstByStatus(DeliveryExecutiveStatus deliveryExecutiveStatus);

    DeliveryExecutive getDeliveryExecutiveByUserEmail(String email);

    List<DeliveryExecutive> findByStatus(DeliveryExecutiveStatus deliveryExecutiveStatus);
}
