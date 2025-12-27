package com.volunteerhub.service;

import com.volunteerhub.entity.Notification;
import com.volunteerhub.entity.User;
import com.volunteerhub.repository.NotificationRepository;
import com.volunteerhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void createNotification(User user, String message) {
        Notification noti = new Notification();
        noti.setUser(user);
        noti.setMessage(message);
        notificationRepository.save(noti);
    }

    public List<Notification> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}