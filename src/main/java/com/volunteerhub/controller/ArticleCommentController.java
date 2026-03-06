package com.volunteerhub.controller;

import com.volunteerhub.dto.CommentRequest;
import com.volunteerhub.entity.ArticleComment;
import com.volunteerhub.service.ArticleCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles/{articleId}/comments")
@RequiredArgsConstructor
public class ArticleCommentController {

    private final ArticleCommentService commentService;

    // 1. Lấy danh sách bình luận của bài viết
    @GetMapping
    public ResponseEntity<List<ArticleComment>> getComments(@PathVariable Long articleId) {
        return ResponseEntity.ok(commentService.getCommentsByArticleId(articleId));
    }

    // 2. Thêm bình luận mới vào bài viết
    @PostMapping
    public ResponseEntity<?> createComment(
            @PathVariable Long articleId,
            @Valid @RequestBody CommentRequest request) {
        try {
            ArticleComment comment = commentService.createComment(articleId, request);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
