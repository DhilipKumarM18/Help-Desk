package com.helpdesk.backend.Repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.Entities.Ticket.Priority;
import com.helpdesk.backend.Entities.Ticket.Status;
import com.helpdesk.backend.Entities.User;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // 🔹 Find tickets created by a specific user (CUSTOMER)
    List<Ticket> findByCreatedBy(User user);

    // 🔹 Advanced filter for AGENT (status, priority, agent assignment, date range)
    @Query("SELECT t FROM Ticket t " +
           "WHERE (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:assignedTo IS NULL OR t.assignedTo.id = :assignedTo) " +
           "AND (:startDate IS NULL OR t.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR t.createdAt <= :endDate)")
    List<Ticket> filterTickets(
        @Param("status") Status status,
        @Param("priority") Priority priority,
        @Param("assignedTo") Long assignedTo,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    // 🔍 Search tickets by title (case-insensitive)
    @Query("SELECT t FROM Ticket t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Ticket> searchByTitle(@Param("keyword") String keyword);
}
