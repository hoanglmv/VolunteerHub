package com.volunteerhub.repository;

import com.volunteerhub.entity.EventTask;
import com.volunteerhub.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventTaskRepository extends JpaRepository<EventTask, Long> {
    List<EventTask> findByEvent(Event event);

    List<EventTask> findByEventId(Long eventId);
}
