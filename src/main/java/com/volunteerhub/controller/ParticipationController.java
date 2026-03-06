package com.volunteerhub.controller;

import com.volunteerhub.entity.Participation;
import com.volunteerhub.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;

    // 1. Dang ky tham gia: POST /participations/events/{eventId}
    @PostMapping("/events/{eventId}")
    public ResponseEntity<?> registerEvent(@PathVariable Long eventId) {
        try {
            Participation p = participationService.registerEvent(eventId);
            return ResponseEntity.ok("Dang ky thanh cong! Ma don: " + p.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Huy dang ky: DELETE /participations/events/{eventId}
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<?> cancelEvent(@PathVariable Long eventId) {
        try {
            participationService.cancelRegistration(eventId);
            return ResponseEntity.ok("Da huy dang ky thanh cong.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. Xem lich su: GET /participations/history
    @GetMapping("/history")
    public ResponseEntity<Page<Participation>> getMyHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(participationService.getMyHistory(page, size));
    }

    // 4. Xem danh sach nguoi tham gia su kien
    @GetMapping("/event/{eventId}/users")
    public ResponseEntity<?> getParticipants(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            return ResponseEntity.ok(participationService.getParticipantsByEvent(eventId, page, size));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. Duyet don dang ky: PUT /participations/{id}/approve?isApproved=true
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveParticipation(@PathVariable Long id, @RequestParam boolean isApproved) {
        try {
            return ResponseEntity.ok(participationService.approveParticipation(id, isApproved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 6. Xem bang xep hang: GET /participations/leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        return ResponseEntity.ok(participationService.getLeaderboard());
    }
}