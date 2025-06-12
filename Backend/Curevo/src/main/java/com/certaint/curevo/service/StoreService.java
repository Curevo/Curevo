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

    public record StoreDistanceInfo(Long storeId, Double distance, Double latitude, Double longitude) {}

    // Method to get stores within a radius, returning the custom DTO
    public List<StoreDistanceInfo> getStoresWithDistancesWithinRadius(double userLat, double userLon, double radiusKm) {
        // Fetch all stores (or optimize this to fetch only potentially relevant stores if your DB supports geo-queries)
        List<Store> allStores = storeRepository.findAll(); // Example: Fetch all stores

        return allStores.stream()
                .map(store -> {
                    double distance = calculateDistance(userLat, userLon, store.getLatitude(), store.getLongitude());
                    if (distance <= radiusKm) {
                        return new StoreDistanceInfo(store.getStoreId(), distance, store.getLatitude(), store.getLongitude());
                    }
                    return null; // Filter out stores outside the radius later
                })
                .filter(info -> info != null) // Remove nulls (stores outside radius)
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of Earth in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // distance in km
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

//    public List<StoreDistanceInfo> getStoresWithDistancesWithinRadius(double lat, double lon, double radiusKm) {
//        return storeRepository.findStoresWithinRadius(lat, lon, radiusKm);
//    }
    public Store updateStore(Long storeId, Store updatedStore) {
        Store existingStore = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeId));

        // Update fields (adapt as needed)
        existingStore.setName(updatedStore.getName());
        existingStore.setAddress(updatedStore.getAddress());
        existingStore.setLatitude(updatedStore.getLatitude());
        existingStore.setLongitude(updatedStore.getLongitude());
        existingStore.setPhoneNumber(updatedStore.getPhoneNumber());


        return storeRepository.save(existingStore);
    }

    public List<Store> getStoresByIds(List<Long> storeIds) {
        return storeRepository.findAllById(storeIds);
    }
    public Optional<Store> getFirstStoreById(){
        return storeRepository.findFirstByOrderByStoreIdAsc();
    }
}
