package com.volunteerhub.repository;

import com.volunteerhub.entity.Event;
import com.volunteerhub.enums.EventStatus;
// 👇 CÁC IMPORT QUAN TRỌNG ĐỂ CHẠY ĐƯỢC PHÂN TRANG & QUERY
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // 1. Các method cũ (Giữ nguyên)
    List<Event> findByStatus(EventStatus status);
    List<Event> findByCreatedById(Long userId);

    // 2. MỚI: Tìm kiếm sự kiện theo từ khóa (Title hoặc Location) + Phân trang
    // Chỉ tìm những sự kiện đã APPROVED
    @Query("SELECT e FROM Event e WHERE e.status = 'APPROVED' AND " +
            "(LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Event> searchEvents(String keyword, Pageable pageable);

    // 3. MỚI: Lấy danh sách sự kiện theo trạng thái + Phân trang
    // Dùng khi người dùng không nhập từ khóa tìm kiếm
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
}