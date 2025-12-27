package com.volunteerhub.service;

import com.volunteerhub.entity.*;
import com.volunteerhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository; // MỚI THÊM: Để xử lý Like

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    // 1. Đăng bài mới
    public Post createPost(Long eventId, String content, String image) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));
        User user = getCurrentUser();

        Post post = new Post();
        post.setContent(content);
        post.setImage(image);
        post.setEvent(event);
        post.setUser(user);

        return postRepository.save(post);
    }

    // 2. Viết bình luận
    public Comment addComment(Long postId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));
        User user = getCurrentUser();

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    // 3. Xem các bài đăng trong sự kiện (Wall)
    public List<Post> getEventPosts(Long eventId) {
        return postRepository.findByEventIdOrderByCreatedAtDesc(eventId);
    }

    // 4. MỚI THÊM: Thả tim / Bỏ tim (Toggle Like)
    public void toggleLike(Long postId) {
        User user = getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        // Kiểm tra xem user này đã like bài này chưa
        Optional<PostLike> existingLike = postLikeRepository.findByUserIdAndPostId(user.getId(), postId);

        if (existingLike.isPresent()) {
            // Nếu like rồi -> Xóa like (Unlike)
            postLikeRepository.delete(existingLike.get());
        } else {
            // Nếu chưa like -> Tạo like mới
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            postLikeRepository.save(like);
        }
    }
}