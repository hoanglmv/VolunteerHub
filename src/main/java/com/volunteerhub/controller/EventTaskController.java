package com.volunteerhub.controller;

import com.volunteerhub.dto.EventTaskRequest;
import com.volunteerhub.dto.EventTaskResponse;
import com.volunteerhub.enums.EventTaskStatus;
import com.volunteerhub.service.EventTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class EventTaskController {

    private final EventTaskService eventTaskService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventTaskResponse>> getTasksByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventTaskService.getTasksByEvent(eventId));
    }

    @PostMapping("/event/{eventId}/creator/{creatorId}")
    public ResponseEntity<EventTaskResponse> createTask(
            @PathVariable Long eventId,
            @PathVariable Long creatorId,
            @RequestBody EventTaskRequest request) {
        return ResponseEntity.ok(eventTaskService.createTask(eventId, creatorId, request));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<EventTaskResponse> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> body) {
        EventTaskStatus status = EventTaskStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(eventTaskService.updateTaskStatus(taskId, status));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        eventTaskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
