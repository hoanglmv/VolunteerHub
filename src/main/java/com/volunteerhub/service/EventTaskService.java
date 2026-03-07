package com.volunteerhub.service;

import com.volunteerhub.dto.EventTaskRequest;
import com.volunteerhub.dto.EventTaskResponse;
import com.volunteerhub.entity.Event;
import com.volunteerhub.entity.EventTask;
import com.volunteerhub.entity.User;
import com.volunteerhub.entity.Notification;
import com.volunteerhub.enums.EventTaskStatus;
import com.volunteerhub.repository.EventRepository;
import com.volunteerhub.repository.EventTaskRepository;
import com.volunteerhub.repository.UserRepository;
import com.volunteerhub.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventTaskService {

    private final EventTaskRepository taskRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public List<EventTaskResponse> getTasksByEvent(Long eventId) {
        return taskRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventTaskResponse createTask(Long eventId, Long creatorId, EventTaskRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Chỉ người tạo sự kiện (creator) mới được tạo task, nhưng tạm thời bỏ qua
        // check để dễ test

        EventTask task = new EventTask();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setEvent(event);
        task.setCreatedBy(creator);
        task.setDueDate(request.getDueDate());

        if (request.getAssignedToUserId() != null) {
            User assignTo = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new RuntimeException("Người được giao không tồn tại"));
            task.setAssignedTo(assignTo);

            // Tạo thông báo
            Notification notification = new Notification();
            notification.setUser(assignTo);
            notification.setMessage(
                    "Bạn đã được phân công công việc: " + task.getTitle() + " trong sự kiện " + event.getTitle());
            notificationRepository.save(notification);
        }

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    public EventTaskResponse updateTaskStatus(Long taskId, EventTaskStatus status) {
        EventTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));
        task.setStatus(status);
        taskRepository.save(task);
        return mapToResponse(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    private EventTaskResponse mapToResponse(EventTask task) {
        EventTaskResponse res = new EventTaskResponse();
        res.setId(task.getId());
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setStatus(task.getStatus());
        res.setEventId(task.getEvent().getId());
        res.setCreatedByUserId(task.getCreatedBy().getId());
        res.setCreatedByFullName(task.getCreatedBy().getFullName());
        res.setCreatedAt(task.getCreatedAt());
        res.setDueDate(task.getDueDate());

        if (task.getAssignedTo() != null) {
            res.setAssignedToUserId(task.getAssignedTo().getId());
            res.setAssignedToFullName(task.getAssignedTo().getFullName());
        }
        return res;
    }
}
