package com.volunteerhub.controller;

import com.volunteerhub.dto.LoginRequest; // Import mới
import com.volunteerhub.dto.RegisterRequest;
import com.volunteerhub.entity.User;
import com.volunteerhub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // (Code cũ giữ nguyên...)
        try {
            User newUser = authService.register(request);
            return ResponseEntity.ok("Đăng ký thành công! ID: " + newUser.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // === API LOGIN MỚI ===
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            // Trả về token cho người dùng
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage()); // 401 Unauthorized
        }
    }
}