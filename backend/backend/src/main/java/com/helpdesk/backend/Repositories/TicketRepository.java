package com.helpdesk.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.Entities.User;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(User user);
}

