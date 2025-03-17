package com.certaint.curevo;

import com.certaint.Utilities.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CurevoApplication {
    public static void main(String[] args) {
        // Load environment variables from .env
        new EnvConfig();

        SpringApplication.run(CurevoApplication.class, args);
    }
}
