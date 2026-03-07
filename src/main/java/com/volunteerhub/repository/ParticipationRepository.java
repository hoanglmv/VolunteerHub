package com.volunteerhub.repository;

import com.volunteerhub.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    // Xem lịch sử tham gia của một user
    Page<Participation> findByUserId(Long userId, Pageable pageable);

    // Lấy danh sách đăng ký theo EventId
    Page<Participation> findByEventId(Long eventId, Pageable pageable);

    // Custom Lấy toàn bộ không phần trang cho backend nội bộ
    java.util.List<Participation> findByEventId(Long eventId);

    // Kiểm tra xem user đã đăng ký sự kiện này chưa (để tránh đăng ký trùng)
    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    // Tìm record để hủy đăng ký
    Optional<Participation> findByUserIdAndEventId(Long userId, Long eventId);

    // [Thành tích] Xếp hạng Tình nguyện viên theo số lượng sự kiện hoàn thành
    @org.springframework.data.jpa.repository.Query("SELECT p.user, COUNT(p) as total FROM Participation p WHERE p.status = 'APPROVED' GROUP BY p.user ORDER BY total DESC")
    java.util.List<Object[]> findTopVolunteers(Pageable pageable);
}