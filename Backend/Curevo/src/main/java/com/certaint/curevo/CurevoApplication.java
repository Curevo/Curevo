package com.certaint.curevo;

import com.certaint.curevo.config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CurevoApplication {
    public static void main(String[] args) {
        // Ensure static block in EnvConfig is triggered
        EnvConfig.get("DUMMY"); // triggers static block and loads .env
        SpringApplication.run(CurevoApplication.class, args);
    }
}
