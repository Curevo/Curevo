package com.certaint.curevo.service;

import com.certaint.curevo.dto.StoreDistanceInfo;
import com.certaint.curevo.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.certaint.curevo.entity.Store;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;

    public Store saveStore(Store store) {
        return storeRepository.save(store);
    }

    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    public Store getStoreById(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeId));
    }

    public void deleteStore(Long storeId) {
        if (!storeRepository.existsById(storeId)) {
            throw new RuntimeException("Store not found with id: " + storeId);
        }
        storeRepository.deleteById(storeId);
    }

    public List<StoreDistanceInfo> getStoresWithDistancesWithinRadius(double lat, double lon, double radiusKm) {
        return storeRepository.findStoresWithinRadius(lat, lon, radiusKm);
    }
    public List<Store> getStoresByIds(List<Long> storeIds) {
        return storeRepository.findAllById(storeIds);
    }
    public Optional<Store> getFirstStoreById(){
        return storeRepository.findFirstByOrderByStoreIdAsc();
    }
}
