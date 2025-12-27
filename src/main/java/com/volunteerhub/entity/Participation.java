package com.volunteerhub.entity;

import com.volunteerhub.enums.ParticipationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "participations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Participation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ai đăng ký?
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Đăng ký sự kiện nào?
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    private ParticipationStatus status;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        // SỬA Ở ĐÂY: Đổi REGISTERED -> PENDING
        if (status == null) status = ParticipationStatus.PENDING;
    }

}