package com.volunteerhub.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig implements WebMvcConfigurer {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
                    throws Exception {
                String ip = request.getRemoteAddr();
                Bucket bucket = cache.computeIfAbsent(ip, this::createNewBucket);

                if (bucket.tryConsume(1)) {
                    return true;
                }

                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests. Please try again later.");
                return false;
            }

            // Giói hạn: 20 requests mỗi phút cho mỗi IP
            private Bucket createNewBucket(String key) {
                Refill refill = Refill.intervally(20, Duration.ofMinutes(1));
                Bandwidth limit = Bandwidth.classic(20, refill);
                return Bucket.builder().addLimit(limit).build();
            }
        }).addPathPatterns("/api/**", "/auth/**", "/events/**", "/participations/**", "/reports/**", "/social/**");
    }
}
