package com.volunteerhub.controller;

import com.volunteerhub.entity.Comment;
import com.volunteerhub.entity.Post;
import com.volunteerhub.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;

    // Lấy danh sách bài đăng của sự kiện: GET /social/events/{eventId}/posts
    @GetMapping("/events/{eventId}/posts")
    public ResponseEntity<List<Post>> getEventPosts(@PathVariable Long eventId) {
        return ResponseEntity.ok(socialService.getEventPosts(eventId));
    }

    // Đăng bài mới: POST /social/events/{eventId}/posts
    @PostMapping("/events/{eventId}/posts")
    public ResponseEntity<?> createPost(@PathVariable Long eventId, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(socialService.createPost(eventId, payload.get("content"), payload.get("image")));
    }

    // Bình luận: POST /social/posts/{postId}/comments
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(socialService.addComment(postId, payload.get("content")));
    }
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId) {
        socialService.toggleLike(postId);
        return ResponseEntity.ok("Thao tác thành công");
    }
}