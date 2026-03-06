package com.volunteerhub.entity;

import com.volunteerhub.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE users SET is_deleted = true WHERE id=?")
@Where(clause = "is_deleted=false")
public class User implements UserDetails { // Implement UserDetails để tích hợp Spring Security

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    // Phục vụ tính năng Xác Thực Email
    @Column(name = "is_active")
    private boolean isActive = false;

    // === CÁC PHƯƠNG THỨC BẮT BUỘC CỦA SPRING SECURITY (USER DETAILS) ===

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Trả về quyền hạn (Role) của user
        return List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email; // Dùng email để làm tên đăng nhập
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive; // Quan trọng: Nếu isActive = false thì Login sẽ thất bại ngay
    }
}