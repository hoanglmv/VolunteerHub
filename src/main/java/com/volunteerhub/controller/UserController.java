package com.volunteerhub.controller;

import com.volunteerhub.dto.ChangePasswordRequest;
import com.volunteerhub.dto.UpdateProfileRequest;
import com.volunteerhub.entity.User;
import com.volunteerhub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Xem hồ sơ: GET /users/profile
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(userService.getUserProfile());
    }

    // Cập nhật hồ sơ: PUT /users/profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    // Đổi mật khẩu: PUT /users/password
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

    // [Admin] Lấy toàn bộ danh sách users: GET /users
    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<org.springframework.data.domain.Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUsers(page, size));
    }

    // [Admin] Chỉnh sửa trạng thái khoá tài khoản người dùng: PUT
    // /users/{id}/status?isActive=...
    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<User> changeUserStatus(@PathVariable Long id, @RequestParam boolean isActive) {
        return ResponseEntity.ok(userService.changeUserStatus(id, isActive));
    }
}