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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nguoi dung"));
    }

    // 1. Tao su kien (Mac dinh la PENDING)
    public Event createEvent(EventRequest request) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new RuntimeException("Thoi gian ket thuc phai sau thoi gian bat dau");
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setCreatedBy(getCurrentUser());

        return eventRepository.save(event);
    }

    // 2. Lay danh sach su kien DA DUYET
    public List<Event> getAllApprovedEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED);
    }

    // 3. Lay TAT CA su kien (Cho Admin)
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // 3.1 Lay danh sach su kien CHO DUYET (Cho Admin)
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING);
    }

    // 4. Duyet hoac Tu choi su kien
    public Event changeStatus(Long eventId, EventStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay su kien co ID: " + eventId));

        event.setStatus(status);
        return eventRepository.save(event);
    }

    // 5. Tim kiem nang cao (Advanced Filtering)
    public Page<Event> searchEvents(String keyword, String location, LocalDateTime fromDate, LocalDateTime toDate,
            int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return eventRepository.searchEventsAdvanced(keyword, location, fromDate, toDate, pageable);
    }
}