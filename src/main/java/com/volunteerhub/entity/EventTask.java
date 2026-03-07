package com.volunteerhub.entity;

import com.volunteerhub.enums.EventTaskStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventTaskStatus status = EventTaskStatus.TODO;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event; // Thuộc sự kiện nào

    @ManyToOne
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo; // Người được giao việc (có thể null nếu chưa giao)

    @ManyToOne
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy; // Ai tạo task (thường là người tạo sự kiện)

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
