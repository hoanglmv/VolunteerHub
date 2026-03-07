package com.volunteerhub.dto;

import lombok.Data;

@Data
public class EventTaskRequest {
    private String title;
    private String description;
    private Long assignedToUserId;
    private java.time.LocalDateTime dueDate;
}
