package com.volunteerhub.service;

import com.volunteerhub.dto.ChangePasswordRequest;
import com.volunteerhub.dto.UpdateProfileRequest;
import com.volunteerhub.entity.User;
import com.volunteerhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Helper: Lấy User hiện tại
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }

    // 1. Lấy thông tin profile
    public User getUserProfile() {
        return getCurrentUser();
    }

    // 2. Cập nhật thông tin
    public User updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        if (request.getFullName() != null)
            user.setFullName(request.getFullName());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        return userRepository.save(user);
    }

    // 3. Đổi mật khẩu
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        // Check pass cũ
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }

        // Lưu pass mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // 4. Lấy danh sách Users (Cho Admin)
    public org.springframework.data.domain.Page<User> searchUsers(String keyword, int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return userRepository.searchUsers(keyword, pageable);
    }

    // 5. Xoá tài khoản cá nhân
    public void deleteMyAccount() {
        User user = getCurrentUser();
        userRepository.delete(user);
    }
}