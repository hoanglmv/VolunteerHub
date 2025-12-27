package com.volunteerhub.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        // Bạn thay thông tin của bạn vào đây nhé
        config.put("cloud_name", "tên_cloud_của_bạn");
        config.put("api_key", "api_key_của_bạn");
        config.put("api_secret", "api_secret_của_bạn");
        return new Cloudinary(config);
    }
}