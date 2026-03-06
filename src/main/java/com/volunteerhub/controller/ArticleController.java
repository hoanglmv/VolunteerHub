package com.volunteerhub.controller;

import com.volunteerhub.dto.ArticleRequest;
import com.volunteerhub.entity.Article;
import com.volunteerhub.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    // 1. Tạo bài viết mới
    @PostMapping
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleRequest request) {
        try {
            Article newArticle = articleService.createArticle(request);
            return ResponseEntity.ok(newArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Lấy danh sách bài viết (Có phân trang)
    @GetMapping
    public ResponseEntity<Page<Article>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(articleService.getAllArticles(page, size));
    }

    // 3. Lấy chi tiết bài viết
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(articleService.getArticleById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
