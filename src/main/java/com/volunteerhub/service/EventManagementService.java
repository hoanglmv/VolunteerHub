package com.volunteerhub.service;

import com.volunteerhub.entity.Event;
import com.volunteerhub.entity.Notification;
import com.volunteerhub.entity.Participation;
import com.volunteerhub.entity.User;
import com.volunteerhub.enums.ParticipationStatus;
import com.volunteerhub.repository.EventRepository;
import com.volunteerhub.repository.NotificationRepository;
import com.volunteerhub.repository.ParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventManagementService {

    private final ParticipationRepository participationRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;

    public List<Participation> getEventParticipants(Long eventId) {
        return participationRepository.findByEventId(eventId);
    }

    public Participation approveOrRejectParticipation(Long participationId, boolean isApprove) {
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng ký"));

        participation.setStatus(isApprove ? ParticipationStatus.CONFIRMED : ParticipationStatus.REJECTED);
        participationRepository.save(participation);

        // Notify user
        Notification notification = new Notification();
        notification.setUser(participation.getUser());
        String eventTitle = participation.getEvent().getTitle();
        notification.setMessage(isApprove
                ? "Đơn đăng ký tham gia sự kiện '" + eventTitle + "' của bạn đã được chấp thuận!"
                : "Rất tiếc, đơn đăng ký sự kiện '" + eventTitle + "' của bạn đã bị từ chối.");
        notificationRepository.save(notification);

        return participation;
    }

    public void broadcastNotification(Long eventId, String message) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));

        List<Participation> confirmedParticipants = participationRepository.findByEventId(eventId).stream()
                .filter(p -> p.getStatus() == ParticipationStatus.CONFIRMED)
                .toList();

        for (Participation p : confirmedParticipants) {
            Notification notification = new Notification();
            notification.setUser(p.getUser());
            notification.setMessage("[Thông báo sự kiện " + event.getTitle() + "]: " + message);
            notificationRepository.save(notification);
        }
    }
}
