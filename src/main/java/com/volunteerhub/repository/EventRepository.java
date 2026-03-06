package com.volunteerhub.repository;

import com.volunteerhub.entity.Event;
import com.volunteerhub.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

        // 1. Cac method cu
        List<Event> findByStatus(EventStatus status);

        long countByStatus(EventStatus status);

        List<Event> findByCreatedById(Long userId);

        // 2. Tim kiem su kien nang cao + Phan trang
        @Query("SELECT e FROM Event e WHERE e.status = 'APPROVED' AND " +
                        "(:keyword IS NULL OR (LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.location) LIKE LOWER(CONCAT('%', :keyword, '%')))) AND "
                        +
                        "(:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
                        "(cast(:fromDate as timestamp) IS NULL OR e.startTime >= :fromDate) AND " +
                        "(cast(:toDate as timestamp) IS NULL OR e.startTime <= :toDate)")
        Page<Event> searchEventsAdvanced(String keyword, String location, LocalDateTime fromDate, LocalDateTime toDate,
                        Pageable pageable);

        // 3. Lay danh sach su kien theo trang thai + Phan trang
        Page<Event> findByStatus(EventStatus status, Pageable pageable);
}