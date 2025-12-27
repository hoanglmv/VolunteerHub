package com.volunteerhub.repository;

import com.volunteerhub.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    // Xem lịch sử tham gia của một user
    List<Participation> findByUserId(Long userId);

    // Kiểm tra xem user đã đăng ký sự kiện này chưa (để tránh đăng ký trùng)
    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    // Tìm record để hủy đăng ký
    Optional<Participation> findByUserIdAndEventId(Long userId, Long eventId);
}