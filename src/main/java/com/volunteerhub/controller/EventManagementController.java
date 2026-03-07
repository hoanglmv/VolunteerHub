package com.volunteerhub.controller;

import com.volunteerhub.entity.Participation;
import com.volunteerhub.service.EventManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manage/events")
@RequiredArgsConstructor
public class EventManagementController {

    private final EventManagementService eventManagementService;

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<Participation>> getParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventManagementService.getEventParticipants(eventId));
    }

    @PostMapping("/participants/{participationId}/approve")
    public ResponseEntity<Participation> approveParticipant(@PathVariable Long participationId) {
        return ResponseEntity.ok(eventManagementService.approveOrRejectParticipation(participationId, true));
    }

    @PostMapping("/participants/{participationId}/reject")
    public ResponseEntity<Participation> rejectParticipant(@PathVariable Long participationId) {
        return ResponseEntity.ok(eventManagementService.approveOrRejectParticipation(participationId, false));
    }

    @PostMapping("/{eventId}/broadcast")
    public ResponseEntity<String> broadcastNotification(@PathVariable Long eventId, @RequestBody String message) {
        eventManagementService.broadcastNotification(eventId, message);
        return ResponseEntity.ok("Đã gửi thông báo thành công");
    }
}
