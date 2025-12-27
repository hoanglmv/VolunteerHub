package com.volunteerhub.service;

import com.volunteerhub.dto.LoginRequest; // Mới thêm
import com.volunteerhub.dto.RegisterRequest;
import com.volunteerhub.entity.User;
import com.volunteerhub.enums.Role;
import com.volunteerhub.repository.UserRepository;
import com.volunteerhub.util.JwtUtil; // Mới thêm
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil; // Inject thêm ông này

    public User register(RegisterRequest request) {
        // (Code cũ giữ nguyên...)
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email này đã được sử dụng!");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.VOLUNTEER);
        return userRepository.save(user);
    }

    // === PHẦN MỚI THÊM ===
    public String login(LoginRequest request) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        // 2. Kiểm tra mật khẩu (so sánh pass thô user nhập vs pass mã hóa trong DB)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng!");
        }

        // 3. Nếu đúng hết -> Sinh Token trả về
        return jwtUtil.generateToken(user.getEmail());
    }
}