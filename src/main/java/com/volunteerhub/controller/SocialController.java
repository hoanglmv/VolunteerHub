package com.volunteerhub.controller;

import com.volunteerhub.entity.Comment;
import com.volunteerhub.entity.Post;
import com.volunteerhub.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;

    // Lay danh sach bai dang cua su kien: GET /social/events/{eventId}/posts
    @GetMapping("/events/{eventId}/posts")
    public ResponseEntity<Page<Post>> getEventPosts(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(socialService.getEventPosts(eventId, page, size));
    }

    // Dang bai moi: POST /social/events/{eventId}/posts
    @PostMapping("/events/{eventId}/posts")
    public ResponseEntity<?> createPost(@PathVariable Long eventId, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(socialService.createPost(eventId, payload.get("content"), payload.get("image")));
    }

    // Binh luan: POST /social/posts/{postId}/comments
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(socialService.addComment(postId, payload.get("content")));
    }

    // Like/Unlike: POST /social/posts/{postId}/like
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId) {
        socialService.toggleLike(postId);
        return ResponseEntity.ok("Thao tac thanh cong");
    }
}