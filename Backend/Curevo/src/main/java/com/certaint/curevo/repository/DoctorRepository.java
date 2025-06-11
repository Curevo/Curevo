package com.certaint.curevo.repository;

import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.enums.Specialization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor,Long> {
    Page<Doctor> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Optional<Doctor> findByNameIgnoreCase(String name);

    List<Doctor> findBySpecialization(Specialization specialty);


}
