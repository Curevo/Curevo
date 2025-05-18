package com.certaint.curevo.service;

import com.certaint.curevo.dto.CustomerDTO;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class SignupCacheService {

    private final Cache<String, CustomerDTO> customerCache;
    private final Cache<String, String> otpCache;

    public SignupCacheService() {
        this.customerCache = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();

        this.otpCache = Caffeine.newBuilder()
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

    public void cacheOtp(String email, String otp) {
        otpCache.put("otp:" + email, otp);
    }

    public String getCachedOtp(String email) {
        return otpCache.getIfPresent("otp:" + email);
    }

    public void evictCachedData(String email) {
        customerCache.invalidate(email);
        otpCache.invalidate("otp:" + email);
    }
}
