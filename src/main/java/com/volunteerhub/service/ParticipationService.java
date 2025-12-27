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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    // Khai báo tất cả các dependency ở đầu class để Lombok @RequiredArgsConstructor tự inject
    private final ParticipationRepository participationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService; // Đưa lên đây

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 1. Đăng ký tham gia (Mặc định là PENDING - Chờ duyệt)
    public Participation registerEvent(Long eventId) {
        User user = getCurrentUser();

        // Kiểm tra sự kiện
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException("Sự kiện chưa được duyệt hoặc đã đóng!");
        }

        // Kiểm tra trùng
        if (participationRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new RuntimeException("Bạn đã đăng ký sự kiện này rồi!");
        }

        Participation participation = new Participation();
        participation.setUser(user);
        participation.setEvent(event);
        participation.setStatus(ParticipationStatus.PENDING);

        return participationRepository.save(participation);
    }

    // 2. Hủy đăng ký
    public void cancelRegistration(Long eventId) {
        User user = getCurrentUser();

        Participation participation = participationRepository.findByUserIdAndEventId(user.getId(), eventId)
                .orElseThrow(() -> new RuntimeException("Bạn chưa đăng ký sự kiện này!"));

        participationRepository.delete(participation);
    }

    // 3. Xem lịch sử tham gia của bản thân
    public List<Participation> getMyHistory() {
        User user = getCurrentUser();
        return participationRepository.findByUserId(user.getId());
    }

    // === PHẦN QUẢN LÝ DUYỆT ĐƠN (ADMIN) ===

    // 4. Lấy danh sách người đăng ký của 1 sự kiện
    public List<Participation> getParticipantsByEvent(Long eventId) {
        return participationRepository.findAll().stream()
                .filter(p -> p.getEvent().getId().equals(eventId))
                .toList();
    }

    // 5. Duyệt hoặc Từ chối đơn đăng ký (Có gửi thông báo)
    public Participation approveParticipation(Long participationId, boolean isApproved) {
        Participation p = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng ký"));

        if (isApproved) {
            p.setStatus(ParticipationStatus.CONFIRMED); // Duyệt

            // GỬI THÔNG BÁO CHÚC MỪNG
            notificationService.createNotification(p.getUser(),
                    "Chúc mừng! Đơn đăng ký tham gia sự kiện '" + p.getEvent().getTitle() + "' đã được duyệt.");
        } else {
            p.setStatus(ParticipationStatus.REJECTED);  // Từ chối

            // GỬI THÔNG BÁO TỪ CHỐI
            notificationService.createNotification(p.getUser(),
                    "Rất tiếc. Đơn đăng ký tham gia sự kiện '" + p.getEvent().getTitle() + "' bị từ chối.");
        }
        return participationRepository.save(p);
    }
}