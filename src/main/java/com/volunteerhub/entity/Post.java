package com.volunteerhub.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String image; // Link ảnh (nếu có)

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Người đăng

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event; // Đăng trong sự kiện nào

    // Quan hệ 1 bài viết có nhiều comment
    // cascade = CascadeType.ALL nghĩa là xóa bài post thì xóa luôn comment
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
}