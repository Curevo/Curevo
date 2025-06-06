package com.certaint.curevo.repository;

import com.certaint.curevo.entity.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Page<Inventory> findByStore_StoreIdIn(List<Long> storeIds, Pageable pageable);
}
