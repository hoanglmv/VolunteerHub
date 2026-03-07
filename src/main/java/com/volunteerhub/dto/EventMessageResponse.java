package com.volunteerhub.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventMessageResponse {
    private Long id;
    private String content;
    private Long eventId;
    private Long senderId;
    private String senderFullName;
    private String senderAvatar;
    private LocalDateTime sentAt;
}
