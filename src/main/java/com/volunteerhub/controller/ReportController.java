package com.volunteerhub.controller;

import com.volunteerhub.dto.ReportRequest;
import com.volunteerhub.entity.Report;
import com.volunteerhub.enums.ReportStatus;
import com.volunteerhub.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // 1. User báo cáo sự kiện: POST /reports/events/{eventId}
    @PostMapping("/events/{eventId}")
    public ResponseEntity<?> createReport(@PathVariable Long eventId, @Valid @RequestBody ReportRequest request) {
        try {
            Report report = reportService.createReport(eventId, request);
            return ResponseEntity.ok("Đã gửi báo cáo thành công! Admin sẽ xem xét sớm nhất.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. [Admin] Xem danh sách báo cáo: GET /reports?status=PENDING
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<Report>> getReports(
            @RequestParam(defaultValue = "PENDING") ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reportService.getReportsByStatus(status, page, size));
    }

    // 3. [Admin] Xử lý báo cáo: PUT /reports/{id}/resolve?isSpam=true
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> resolveReport(@PathVariable Long id, @RequestParam boolean isSpam) {
        try {
            return ResponseEntity.ok(reportService.resolveReport(id, isSpam));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
