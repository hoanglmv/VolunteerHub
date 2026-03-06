package com.volunteerhub.entity;

import com.volunteerhub.enums.EventStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE events SET is_deleted = true WHERE id=?")
@Where(clause = "is_deleted=false")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Ai tạo sự kiện này?
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // Mặc định mới tạo là chờ duyệt
        if (status == null) status = EventStatus.PENDING;
    }
}