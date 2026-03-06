package com.volunteerhub.service;

import com.volunteerhub.dto.CommentRequest;
import com.volunteerhub.entity.Article;
import com.volunteerhub.entity.ArticleComment;
import com.volunteerhub.entity.User;
import com.volunteerhub.repository.ArticleCommentRepository;
import com.volunteerhub.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleCommentService {

    private final ArticleCommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserService userService;

    public ArticleComment createComment(Long articleId, CommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        ArticleComment comment = new ArticleComment();
        comment.setContent(request.getContent());
        comment.setAuthor(currentUser);
        comment.setArticle(article);

        return commentRepository.save(comment);
    }

    public List<ArticleComment> getCommentsByArticleId(Long articleId) {
        return commentRepository.findByArticleIdOrderByCreatedAtDesc(articleId);
    }
}
