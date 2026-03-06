package com.volunteerhub.service;

import com.volunteerhub.entity.Event;
import com.volunteerhub.entity.Participation;
import com.volunteerhub.entity.User;
import com.volunteerhub.enums.EventStatus;
import com.volunteerhub.enums.ParticipationStatus;
import com.volunteerhub.repository.EventRepository;
import com.volunteerhub.repository.ParticipationRepository;
import com.volunteerhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 1. Dang ky tham gia (Mac dinh la PENDING)
    public Participation registerEvent(Long eventId) {
        User user = getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Su kien khong ton tai"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException("Su kien chua duoc duyet hoac da dong!");
        }

        if (participationRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new RuntimeException("Ban da dang ky su kien nay roi!");
        }

        Participation participation = new Participation();
        participation.setUser(user);
        participation.setEvent(event);
        participation.setStatus(ParticipationStatus.PENDING);

        return participationRepository.save(participation);
    }

    // 2. Huy dang ky
    public void cancelRegistration(Long eventId) {
        User user = getCurrentUser();

        Participation participation = participationRepository.findByUserIdAndEventId(user.getId(), eventId)
                .orElseThrow(() -> new RuntimeException("Ban chua dang ky su kien nay!"));

        participationRepository.delete(participation);
    }

    // 3. Xem lich su tham gia cua ban than
    public Page<Participation> getMyHistory(int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("registeredAt").descending());
        return participationRepository.findByUserId(user.getId(), pageable);
    }

    // 4. Lay danh sach nguoi dang ky cua 1 su kien
    public Page<Participation> getParticipantsByEvent(Long eventId, int page, int size) {
        User currentUser = getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Su kien khong ton tai"));

        if (!event.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Chi nguoi tao su kien moi duoc xem danh sach dang ky.");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("registeredAt").descending());
        return participationRepository.findByEventId(eventId, pageable);
    }

    // 5. Duyet hoac Tu choi don dang ky (Co gui thong bao)
    public Participation approveParticipation(Long participationId, boolean isApproved) {
        Participation p = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay don dang ky"));

        User currentUser = getCurrentUser();
        if (!p.getEvent().getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Chi nguoi tao su kien moi co quyen duyet don dang ky nay.");
        }

        if (isApproved) {
            p.setStatus(ParticipationStatus.CONFIRMED);
            notificationService.createNotification(p.getUser(),
                    "Chuc mung! Don dang ky tham gia su kien '" + p.getEvent().getTitle() + "' da duoc duyet.");
        } else {
            p.setStatus(ParticipationStatus.REJECTED);
            notificationService.createNotification(p.getUser(),
                    "Rat tiec. Don dang ky tham gia su kien '" + p.getEvent().getTitle() + "' bi tu choi.");
        }
        return participationRepository.save(p);
    }
}