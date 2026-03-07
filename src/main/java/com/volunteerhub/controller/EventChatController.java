package com.volunteerhub.controller;

import com.volunteerhub.dto.EventMessageRequest;
import com.volunteerhub.dto.EventMessageResponse;
import com.volunteerhub.service.EventChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EventChatController {

    private final EventChatService eventChatService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/api/chat/events/{eventId}")
    public ResponseEntity<List<EventMessageResponse>> getEventMessages(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventChatService.getEventMessages(eventId));
    }

    // Nhận tin nhắn từ STOMP client
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload EventMessageRequest chatMessage) {
        // Lưu vào DB
        EventMessageResponse savedMessage = eventChatService.saveMessage(chatMessage);

        // Gửi broad cast cho tất cả người trong room event đó
        messagingTemplate.convertAndSend("/topic/event/" + chatMessage.getEventId(), savedMessage);
    }
}
