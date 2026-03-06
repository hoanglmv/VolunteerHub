package com.volunteerhub.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Spring Boot sẽ tự động cấu hình Caffeine nếu tìm thấy thư viện trên
    // classpath.
}
