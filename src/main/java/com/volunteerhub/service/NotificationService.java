package com.volunteerhub.service;

import com.volunteerhub.entity.Notification;
import com.volunteerhub.entity.User;
import com.volunteerhub.repository.NotificationRepository;
import com.volunteerhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public void createNotification(User user, String message) {
        Notification noti = new Notification();
        noti.setUser(user);
        noti.setMessage(message);
        notificationRepository.save(noti);

        // Đẩy thông báo theo thời gian thực (Real-time Push) qua WebSocket
        messagingTemplate.convertAndSend("/topic/user/" + user.getId() + "/notifications", noti);
    }

    public Page<Notification> getMyNotifications(int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
    }

    public void markAsRead(Long notificationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Notification noti = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));

        if (!noti.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền truy cập thông báo này");
        }

        noti.setRead(true);
        notificationRepository.save(noti);
    }

    public void markAllAsRead() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        java.util.List<Notification> unreadNotis = notificationRepository.findByUserIdAndIsReadFalse(user.getId());
        unreadNotis.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotis);
    }
}