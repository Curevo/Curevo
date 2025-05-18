package com.certaint.curevo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @GetMapping("/healthz")
    public String healthCheck() {
        System.out.println("Health check endpoint hit");
        return "Curevo is live";
    }
}
