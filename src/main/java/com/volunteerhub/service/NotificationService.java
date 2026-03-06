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

    public void createNotification(User user, String message) {
        Notification noti = new Notification();
        noti.setUser(user);
        noti.setMessage(message);
        notificationRepository.save(noti);
    }

    public Page<Notification> getMyNotifications(int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
    }
}