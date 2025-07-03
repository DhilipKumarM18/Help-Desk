package com.helpdesk.backend.Repositories;

import com.helpdesk.backend.Entities.Comment;
import com.helpdesk.backend.Entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Custom method to find comments by ticket
    List<Comment> findByTicket(Ticket ticket);
}