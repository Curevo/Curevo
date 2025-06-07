package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Store;
import com.certaint.curevo.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;


    @PostMapping()
    public ResponseEntity<ApiResponse<Store>> createStore(@RequestBody Store store) {
        Store savedStore = storeService.saveStore(store);
        ApiResponse<Store> response = new ApiResponse<>(true, "Store created successfully", savedStore);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Store>>> getAllStores() {
        List<Store> stores = storeService.getAllStores();
        ApiResponse<List<Store>> response = new ApiResponse<>(true, "Stores retrieved successfully", stores);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Store>> getStoreById(@PathVariable Long id) {
        Store store = storeService.getStoreById(id);
        ApiResponse<Store> response = new ApiResponse<>(true, "Store retrieved successfully", store);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        ApiResponse<String> response = new ApiResponse<>(true, "Store deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}
