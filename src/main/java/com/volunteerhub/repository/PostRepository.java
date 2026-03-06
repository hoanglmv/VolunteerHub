package com.volunteerhub.repository;

import com.volunteerhub.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Lấy tất cả bài đăng của 1 sự kiện, sắp xếp mới nhất lên đầu (PHÂN TRANG)
    Page<Post> findByEventIdOrderByCreatedAtDesc(Long eventId, Pageable pageable);
}