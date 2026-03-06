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

    // Xóa tài khoản: DELETE /users/me
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount() {
        userService.deleteMyAccount();
        return ResponseEntity.ok("Tài khoản đã được xóa vĩnh viễn.");
    }

    // Danh sách người dùng (Admin): GET /users
    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<org.springframework.data.domain.Page<User>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.searchUsers(keyword, page, size));
    }
}