package com.volunteerhub.service;

import com.volunteerhub.entity.*;
import com.volunteerhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nguoi dung"));
    }

    // 1. Dang bai moi
    public Post createPost(Long eventId, String content, String image) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Su kien khong ton tai"));
        User user = getCurrentUser();

        Post post = new Post();
        post.setContent(content);
        post.setImage(image);
        post.setEvent(event);
        post.setUser(user);

        return postRepository.save(post);
    }

    // 2. Viet binh luan
    public Comment addComment(Long postId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Bai viet khong ton tai"));
        User user = getCurrentUser();

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    // 3. Xem cac bai dang trong su kien (Wall)
    public Page<Post> getEventPosts(Long eventId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByEventIdOrderByCreatedAtDesc(eventId, pageable);
    }

    // 4. Tha tim / Bo tim (Toggle Like)
    public void toggleLike(Long postId) {
        User user = getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Bai viet khong ton tai"));

        Optional<PostLike> existingLike = postLikeRepository.findByUserIdAndPostId(user.getId(), postId);

        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
        } else {
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            postLikeRepository.save(like);
        }
    }
}