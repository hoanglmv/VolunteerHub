package com.volunteerhub.controller;

import com.volunteerhub.dto.EventRequest;
import com.volunteerhub.entity.Event;
import com.volunteerhub.enums.EventStatus;
import com.volunteerhub.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
// 👇 QUAN TRỌNG: Import này để dùng được tính năng Phân trang
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // 1. Tạo sự kiện mới
    @PostMapping
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventRequest request) {
        try {
            Event newEvent = eventService.createEvent(request);
            return ResponseEntity.ok(newEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Xem danh sách sự kiện (Đã duyệt) - Dành cho TNV (API cũ, trả về List)
    @GetMapping
    public ResponseEntity<List<Event>> getApprovedEvents() {
        return ResponseEntity.ok(eventService.getAllApprovedEvents());
    }

    // 3. Xem tất cả sự kiện (Dành cho Admin quản lý)
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')") // Bảo mật: Chỉ Admin mới xem được tất cả
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // 4. Duyệt hoặc Từ chối sự kiện (Chỉ ADMIN)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestParam EventStatus status) {
        try {
            Event updatedEvent = eventService.changeStatus(id, status);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. MỚI: API Tìm kiếm & Phân trang
    // Cách dùng: GET /events/search?keyword=hcm&page=0&size=5
    @GetMapping("/search")
    public ResponseEntity<Page<Event>> searchEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(eventService.searchEvents(keyword, page, size));
    }
}