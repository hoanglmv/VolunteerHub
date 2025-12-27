package com.volunteerhub.repository;

import com.volunteerhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm user bằng email
    Optional<User> findByEmail(String email);

    // Kiểm tra nhanh xem email đã tồn tại chưa (trả về true/false)
    boolean existsByEmail(String email);
}