package com.certaint.curevo.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OtpService {

    private final SignupCacheService cacheService;

    public OtpService(SignupCacheService cacheService) {
        this.cacheService = cacheService;
    }

    public String generateOtp(String email) {
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        cacheService.cacheOtp(email, otp);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        String cachedOtp = cacheService.getCachedOtp(email);
        return otp != null && otp.equals(cachedOtp);
    }

    public void clearOtp(String email) {
        cacheService.evictCachedData(email);
    }
}

