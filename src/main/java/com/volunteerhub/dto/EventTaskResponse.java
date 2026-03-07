package com.volunteerhub.dto;

import com.volunteerhub.enums.EventTaskStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventTaskResponse {
    private Long id;
    private String title;
    private String description;
    private EventTaskStatus status;
    private Long eventId;
    private Long assignedToUserId;
    private String assignedToFullName;
    private Long createdByUserId;
    private String createdByFullName;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
}
