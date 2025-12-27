package com.volunteerhub.controller;

import com.volunteerhub.entity.Participation;
import com.volunteerhub.service.ParticipationService; // <--- QUAN TRỌNG: Phải có dòng import này
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;

    // === PHẦN CHO TÌNH NGUYỆN VIÊN (USER) ===

    // 1. Đăng ký tham gia: POST /participations/events/{eventId}
    @PostMapping("/events/{eventId}")
    public ResponseEntity<?> registerEvent(@PathVariable Long eventId) {
        try {
            Participation p = participationService.registerEvent(eventId);
            return ResponseEntity.ok("Đăng ký thành công! Mã đơn: " + p.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Hủy đăng ký: DELETE /participations/events/{eventId}
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<?> cancelEvent(@PathVariable Long eventId) {
        try {
            participationService.cancelRegistration(eventId);
            return ResponseEntity.ok("Đã hủy đăng ký thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. Xem lịch sử: GET /participations/history
    @GetMapping("/history")
    public ResponseEntity<List<Participation>> getMyHistory() {
        return ResponseEntity.ok(participationService.getMyHistory());
    }

    // === PHẦN CHO QUẢN LÝ / ADMIN ===

    // 4. Xem danh sách người tham gia sự kiện
    @GetMapping("/event/{eventId}/users")
    @PreAuthorize("hasAnyAuthority('ADMIN')") // Chỉ Admin mới được xem
    public ResponseEntity<List<Participation>> getParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(participationService.getParticipantsByEvent(eventId));
    }

    // 5. Duyệt đơn đăng ký: PUT /participations/{id}/approve?isApproved=true
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('ADMIN')") // Chỉ Admin mới được duyệt
    public ResponseEntity<?> approveParticipation(@PathVariable Long id, @RequestParam boolean isApproved) {
        try {
            return ResponseEntity.ok(participationService.approveParticipation(id, isApproved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}