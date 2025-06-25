package com.helpdesk.backend.Repositories;

import com.helpdesk.backend.Entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
