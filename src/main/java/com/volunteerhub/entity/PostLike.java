package com.volunteerhub.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "post_likes") // Tên bảng trong database
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ai là người like?
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Like bài viết nào?
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}