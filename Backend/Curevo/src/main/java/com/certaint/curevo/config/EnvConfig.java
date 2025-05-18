package com.certaint.curevo.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    private static final Dotenv dotenv = loadEnv();

    private static Dotenv loadEnv() {
        try {
            return Dotenv.configure()
                    .ignoreIfMissing()
                    .load();
        } catch (Exception e) {
            System.err.println("Warning: .env file not found or failed to load.");
            return null;
        }
    }

    public static String get(String key) {

        if (dotenv != null && dotenv.get(key) != null) {
            return dotenv.get(key);
        }
        return System.getenv(key);
    }
}
