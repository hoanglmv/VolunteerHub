package com.volunteerhub.repository;

import com.volunteerhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm user bằng email
    Optional<User> findByEmail(String email);

    // Kiểm tra nhanh xem email đã tồn tại chưa (trả về true/false)
    boolean existsByEmail(String email);

    // Tìm kiếm User cho Admin
    @Query("SELECT u FROM User u WHERE " +
            "(:keyword IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    org.springframework.data.domain.Page<User> searchUsers(String keyword,
            org.springframework.data.domain.Pageable pageable);
}