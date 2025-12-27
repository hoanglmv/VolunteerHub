package com.volunteerhub.service;

import com.volunteerhub.dto.EventRequest;
import com.volunteerhub.entity.Event;
import com.volunteerhub.entity.User;
import com.volunteerhub.enums.EventStatus;
import com.volunteerhub.repository.EventRepository;
import com.volunteerhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    // Helper: Lấy User đang đăng nhập hiện tại
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    // 1. Tạo sự kiện (Mặc định là PENDING)
    public Event createEvent(EventRequest request) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());

        // Gán người tạo là user đang đăng nhập
        event.setCreatedBy(getCurrentUser());

        return eventRepository.save(event);
    }

    // 2. Lấy danh sách sự kiện ĐÃ DUYỆT (Cho Tình nguyện viên xem - List thường)
    public List<Event> getAllApprovedEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED);
    }

    // 3. Lấy TẤT CẢ sự kiện (Cho Admin quản lý)
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // 4. Duyệt hoặc Từ chối sự kiện (Chức năng của Admin)
    public Event changeStatus(Long eventId, EventStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện có ID: " + eventId));

        event.setStatus(status);
        return eventRepository.save(event);
    }

    // 5. MỚI: Tìm kiếm và Phân trang (Cho trang chủ)
    public Page<Event> searchEvents(String keyword, int page, int size) {
        // Sắp xếp mặc định: Mới nhất lên đầu
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (keyword != null && !keyword.isEmpty()) {
            return eventRepository.searchEvents(keyword, pageable);
        } else {
            return eventRepository.findByStatus(EventStatus.APPROVED, pageable);
        }
    }
}