package com.volunteerhub.service;

import com.volunteerhub.dto.ReportRequest;
import com.volunteerhub.entity.Event;
import com.volunteerhub.entity.Report;
import com.volunteerhub.entity.User;
import com.volunteerhub.enums.EventStatus;
import com.volunteerhub.enums.ReportStatus;
import com.volunteerhub.repository.EventRepository;
import com.volunteerhub.repository.ReportRepository;
import com.volunteerhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    // 1. User báo cáo sự kiện
    public Report createReport(Long eventId, ReportRequest request) {
        User user = getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));

        Report report = new Report();
        report.setReporter(user);
        report.setEvent(event);
        report.setReason(request.getReason());
        report.setStatus(ReportStatus.PENDING);
        report.setCreatedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }

    // 2. Lấy danh sách Report (Dành cho Admin)
    public Page<Report> getReportsByStatus(ReportStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reportRepository.findByStatus(status, pageable);
    }

    // 3. Xử lý Report (Admin)
    public Report resolveReport(Long reportId, boolean isSpam) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo"));

        if (isSpam) {
            // Đánh dấu sự kiện là bị khoá/xoá mềm do vi phạm
            report.setStatus(ReportStatus.RESOLVED);
            Event event = report.getEvent();
            event.setStatus(EventStatus.REJECTED);
            event.setDeleted(true); // Xoá mềm
            eventRepository.save(event);

            // Gửi thông báo cho người tạo sự kiện
            notificationService.createNotification(event.getCreatedBy(),
                    "Sự kiện '" + event.getTitle() + "' của bạn đã bị xoá do vi phạm tiêu chuẩn cộng đồng.");
        } else {
            // Báo cáo sai sự thật -> Bỏ qua báo cáo
            report.setStatus(ReportStatus.DISMISSED);
        }

        return reportRepository.save(report);
    }
}
