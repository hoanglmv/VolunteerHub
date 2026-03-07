package com.volunteerhub.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event; // Tin nhắn nằm trong nhóm sự kiện nào

    @ManyToOne
    @JoinColumn(name = "sender_user_id", nullable = false)
    private User sender; // Ai gửi

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }
}
