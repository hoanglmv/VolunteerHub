package com.volunteerhub.service;

import com.volunteerhub.dto.ArticleRequest;
import com.volunteerhub.entity.Article;
import com.volunteerhub.entity.User;
import com.volunteerhub.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserService userService;

    public Article createArticle(ArticleRequest request) {
        User currentUser = userService.getCurrentUser();

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setImageUrl(request.getImageUrl());
        article.setAuthor(currentUser);

        return articleRepository.save(article);
    }

    public Page<Article> getAllArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return articleRepository.findAll(pageable);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));
    }
}
