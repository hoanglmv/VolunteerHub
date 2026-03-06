package com.volunteerhub.controller;

import com.volunteerhub.repository.EventRepository;
import com.volunteerhub.repository.ParticipationRepository;
import com.volunteerhub.repository.UserRepository;
import com.volunteerhub.repository.ReportRepository;
import com.volunteerhub.enums.EventStatus;
import com.volunteerhub.enums.ReportStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final ReportRepository reportRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN')") // Chỉ Admin mới xem được thống kê
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();

        // Đếm số lượng
        stats.put("totalUsers", userRepository.count());
        stats.put("totalEvents", eventRepository.count());
        stats.put("pendingEvents", eventRepository.countByStatus(EventStatus.PENDING));
        stats.put("pendingReports", reportRepository.countByStatus(ReportStatus.PENDING));

        return ResponseEntity.ok(stats);
    }
}