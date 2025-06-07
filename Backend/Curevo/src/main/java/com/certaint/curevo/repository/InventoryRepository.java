package com.certaint.curevo.repository;

import com.certaint.curevo.entity.Inventory;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // Existing method, ensure it's named exactly like this
    Page<Inventory> findByStore_StoreIdIn(List<Long> storeIds, Pageable pageable);

    // NEW: For getInventoryByProductAndStore
    Optional<Inventory> findByProductAndStore(Product product, Store store);

    // NEW: For getInventoriesByProduct
    List<Inventory> findByProduct(Product product);


    @Query("SELECT i FROM Inventory i JOIN FETCH i.store WHERE i.product = :product")
    List<Inventory> findByProductWithStore(@Param("product") Product product);

}