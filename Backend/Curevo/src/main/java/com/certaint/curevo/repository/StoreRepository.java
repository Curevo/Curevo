package com.certaint.curevo.repository;


import com.certaint.curevo.dto.StoreDistanceInfo;
import com.certaint.curevo.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Long> {

    @Query(value = "SELECT s.store_id AS storeId, " + // Alias as storeId
            "(6371 * acos(" +
            "cos(radians(:userLat)) * cos(radians(s.latitude)) * " +
            "cos(radians(s.longitude) - radians(:userLon)) + " +
            "sin(radians(:userLat)) * sin(radians(s.latitude))" +
            ")) AS distance " +
            "FROM stores s " +
            "WHERE (6371 * acos(" +
            "cos(radians(:userLat)) * cos(radians(s.latitude)) * " +
            "cos(radians(s.longitude) - radians(:userLon)) + " +
            "sin(radians(:userLat)) * sin(radians(s.latitude))" +
            ")) <= :radiusKm",
            nativeQuery = true)
    List<StoreDistanceInfo> findStoresWithinRadius(@Param("userLat") double userLat,
                                                   @Param("userLon") double userLon,
                                                   @Param("radiusKm") double radiusKm);
    Optional<Store> findFirstByOrderByStoreIdAsc();
}

