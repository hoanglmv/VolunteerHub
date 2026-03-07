package com.volunteerhub.dto;

import lombok.Data;

@Data
public class EventMessageRequest {
    private String content;
    private Long senderId;
    private Long eventId;
}
