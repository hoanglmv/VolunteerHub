package com.volunteerhub.service;

import com.volunteerhub.dto.EventMessageRequest;
import com.volunteerhub.dto.EventMessageResponse;
import com.volunteerhub.entity.Event;
import com.volunteerhub.entity.EventMessage;
import com.volunteerhub.entity.User;
import com.volunteerhub.repository.EventMessageRepository;
import com.volunteerhub.repository.EventRepository;
import com.volunteerhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventChatService {

    private final EventMessageRepository messageRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public List<EventMessageResponse> getEventMessages(Long eventId) {
        return messageRepository.findByEventIdOrderBySentAtAsc(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventMessageResponse saveMessage(EventMessageRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Sự kiện không tồn tại"));
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        EventMessage message = new EventMessage();
        message.setContent(request.getContent());
        message.setEvent(event);
        message.setSender(sender);

        message = messageRepository.save(message);
        return mapToResponse(message);
    }

    private EventMessageResponse mapToResponse(EventMessage message) {
        EventMessageResponse res = new EventMessageResponse();
        res.setId(message.getId());
        res.setContent(message.getContent());
        res.setEventId(message.getEvent().getId());
        res.setSenderId(message.getSender().getId());
        res.setSenderFullName(message.getSender().getFullName());
        res.setSenderAvatar(message.getSender().getAvatar());
        res.setSentAt(message.getSentAt());
        return res;
    }
}
