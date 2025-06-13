package com.certaint.curevo.service;

import com.certaint.curevo.dto.CustomerDTO;
import com.certaint.curevo.dto.DeliveryExecutiveDTO;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class CacheService {

    private final Cache<String, CustomerDTO> customerCache;
    private final Cache<String, String> otpCache;
    private final Cache<String, DeliveryExecutiveDTO> deliveryExecutiveCache;
    private final Cache<String, String> deliveryOtpCache;

    public CacheService() {
        this.customerCache = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();

        this.otpCache = Caffeine.newBuilder()
                .expireAfterWrite(3, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();
        this.deliveryExecutiveCache=Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();
        this.deliveryOtpCache = Caffeine.newBuilder()
                .expireAfterWrite(2, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();
    }

    public void cacheCustomerData(String email, CustomerDTO customerDTO) {
        customerCache.put(email, customerDTO);
    }

    public CustomerDTO getCachedCustomerData(String email) {
        return customerCache.getIfPresent(email);
    }
    public void cacheDeliveryExecutiveData(String email, DeliveryExecutiveDTO deliveryExecutiveDTO) {
        deliveryExecutiveCache.put(email, deliveryExecutiveDTO);
    }
    public DeliveryExecutiveDTO getCachedDeliveryExecutiveData(String email) {
        return deliveryExecutiveCache.getIfPresent(email);
    }

    public void cacheOtp(String email, String otp) {
        otpCache.put("otp:" + email, otp);
    }

    public String getCachedOtp(String email) {
        return otpCache.getIfPresent("otp:" + email);
    }

    public void evictCachedData(String email) {
        customerCache.invalidate(email);
        otpCache.invalidate("otp:" + email);
        deliveryExecutiveCache.invalidate(email);
    }

    public void cacheOtpForDelivery(String assignmentId, String otp) {
        deliveryOtpCache.put("delivery_otp:" + assignmentId, otp);
    }

    public String getCachedOtpForDelivery(String assignmentId) {
        return deliveryOtpCache.getIfPresent("delivery_otp:" + assignmentId);
    }

    public void evictCachedOtpForDelivery(String assignmentId) {
        deliveryOtpCache.invalidate("delivery_otp:" + assignmentId);
    }
}