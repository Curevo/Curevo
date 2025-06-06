package com.certaint.curevo.service;

import com.certaint.curevo.entity.Inventory;
import com.certaint.curevo.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // READ BY ID
    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    // UPDATE
    public Inventory updateInventory(Long id, Inventory updatedInventory) {
        return inventoryRepository.findById(id)
                .map(existingInventory -> {
                    existingInventory.setProduct(updatedInventory.getProduct());
                    existingInventory.setStore(updatedInventory.getStore());
                    existingInventory.setStock(updatedInventory.getStock());
                    // add any other fields you have!
                    return inventoryRepository.save(existingInventory);
                })
                .orElseThrow(() -> new RuntimeException("Inventory not found with id " + id));
    }

    // DELETE
    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

    public Page<Inventory> getInventoriesByStoreIds(List<Long> storeIds, Pageable pageable) {
        return inventoryRepository.findByStore_StoreIdIn(storeIds, pageable);
    }
}
