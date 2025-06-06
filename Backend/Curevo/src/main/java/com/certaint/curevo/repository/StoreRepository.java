package com.certaint.curevo.repository;


import com.certaint.curevo.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {

    @Query(value = """
        SELECT s 
        FROM Store s 
        WHERE 
            (6371 * acos(cos(radians(:userLat)) 
            * cos(radians(s.latitude)) 
            * cos(radians(s.longitude) - radians(:userLon)) 
            + sin(radians(:userLat)) 
            * sin(radians(s.latitude)))) <= :radiusKm
        """)
    List<Store> findStoresWithinRadius(
            @Param("userLat") double userLat,
            @Param("userLon") double userLon,
            @Param("radiusKm") double radiusKm
    );
}
