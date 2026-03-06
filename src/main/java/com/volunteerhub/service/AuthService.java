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

import com.volunteerhub.entity.VerificationToken;
import com.volunteerhub.repository.VerificationTokenRepository;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final VerificationTokenRepository tokenRepository;
    private final MailService mailService;

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email này đã được sử dụng!");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        user.setActive(false); // MỚI: Phải chờ xác nhận Email
        userRepository.save(user);

        // 1. Tạo JWT/UUID Token cho xác thực
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(15)); // Hết hạn sau 15p
        tokenRepository.save(verificationToken);

        // 2. Gửi Email (Bất đồng bộ)
        String verifyLink = "http://localhost:8080/auth/verify?token=" + token;
        mailService.sendEmail(user.getEmail(), "Xác thực tài khoản VolunteerHub", 
            "Chào " + user.getFullName() + ",\n\nVui lòng click vào link sau để xác thực tài khoản (có hiệu lực 15 phút):\n" + verifyLink);

        return "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.";
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

        // 3. Nếu đúng hết -> Sinh Token trả về (Chỉ cho user đã active)
        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản chưa được xác thực Email!");
        }
        return jwtUtil.generateToken(user.getEmail());
    }

    // === XÁC THỰC EMAIL TỪ LINK ===
    public String verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ hoặc không tồn tại!"));

        if (verificationToken.isExpired()) {
            throw new RuntimeException("Token đã hết hạn!");
        }

        User user = verificationToken.getUser();
        user.setActive(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken); // Xác thực xong thì xóa đi
        return "Xác thực tài khoản thành công! Bạn có thể đăng nhập.";
    }

    // === YÊU CẦU QUÊN MẬT KHẨU ===
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email này!"));

        // Xóa token cũ nếu có
        tokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        VerificationToken resetToken = new VerificationToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);

        // Link này giả định trỏ tới Frontend React để nó render form nhập Pass mới
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        mailService.sendEmail(user.getEmail(), "Yêu cầu khôi phục mật khẩu",
                "Chào " + user.getFullName() + ",\n\nBạn đã yêu cầu khôi phục mật khẩu. Vui lòng bấm vào link sau (có hiệu lực 15 phút):\n" + resetLink);

        return "Email khôi phục đã được gửi. Vui lòng kiểm tra Hộp thư.";
    }

    // === ĐẶT LẠI MẬT KHẨU ===
    public String resetPassword(String token, String newPassword) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Mã khôi phục không hợp lệ!"));

        if (verificationToken.isExpired()) {
            throw new RuntimeException("Mã khôi phục đã hết hạn!");
        }

        User user = verificationToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        tokenRepository.delete(verificationToken);
        return "Đổi mật khẩu thành công!";
    }
}