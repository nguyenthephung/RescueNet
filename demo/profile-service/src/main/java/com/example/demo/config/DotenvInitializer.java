package com.example.demo.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Load .env file từ root project (2 cấp trên service folder)
 */
public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        
        // Tìm file .env ở root project (2 cấp trên)
        File projectRoot = new File(System.getProperty("user.dir")).getParentFile();
        if (projectRoot == null) {
            projectRoot = new File(System.getProperty("user.dir"));
        }
        
        File envFile = new File(projectRoot, ".env");
        
        if (!envFile.exists()) {
            // Thử tìm ở current directory (trường hợp chạy từ root)
            envFile = new File(System.getProperty("user.dir"), ".env");
        }
        
        if (envFile.exists()) {
            Map<String, Object> envProperties = loadEnvFile(envFile);
            environment.getPropertySources().addFirst(new MapPropertySource("dotenv", envProperties));
            System.out.println("✓ Loaded .env file from: " + envFile.getAbsolutePath());
        } else {
            System.out.println("⚠ .env file not found at: " + envFile.getAbsolutePath());
        }
    }

    private Map<String, Object> loadEnvFile(File envFile) {
        Map<String, Object> properties = new HashMap<>();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                // Skip comments and empty lines
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                
                // Parse KEY=VALUE
                int equalIndex = line.indexOf('=');
                if (equalIndex > 0) {
                    String key = line.substring(0, equalIndex).trim();
                    String value = line.substring(equalIndex + 1).trim();
                    
                    // Remove quotes if present
                    if (value.startsWith("\"") && value.endsWith("\"")) {
                        value = value.substring(1, value.length() - 1);
                    }
                    
                    properties.put(key, value);
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading .env file: " + e.getMessage());
        }
        
        return properties;
    }
}
