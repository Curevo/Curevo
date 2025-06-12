package com.certaint.curevo.repository;

import com.certaint.curevo.entity.DeliveryAssignment;
import com.certaint.curevo.entity.DeliveryExecutive;
import com.certaint.curevo.enums.DeliveryAssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, Long> {
    List<DeliveryAssignment> findByExecutiveAndStatusIn(DeliveryExecutive executive, List<DeliveryAssignmentStatus> current);

    Optional<DeliveryAssignment> findByExecutiveAndStatus(DeliveryExecutive executive, DeliveryAssignmentStatus deliveryAssignmentStatus);

    List<DeliveryAssignment> findByExecutive(DeliveryExecutive executive);

    List<DeliveryAssignment> findAllByExecutiveAndStatus(DeliveryExecutive executive, DeliveryAssignmentStatus deliveryAssignmentStatus);

    Long countByExecutiveAndStatus(DeliveryExecutive executive, DeliveryAssignmentStatus status);

}
