package com.volunteerhub.repository;

import com.volunteerhub.entity.EventMessage;
import com.volunteerhub.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventMessageRepository extends JpaRepository<EventMessage, Long> {
    @Query("SELECT m FROM EventMessage m WHERE m.event.id = :eventId ORDER BY m.sentAt ASC")
    List<EventMessage> findByEventIdOrderBySentAtAsc(@Param("eventId") Long eventId);
}
