package com.helpdesk.backend.Entities;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id //primary key:
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne //one comment associated with one user:
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne //one comment associated with one ticket:
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "created_at")//time-stamp:
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Comment() {}

    public Comment(String content, User user, Ticket ticket) {
        this.content = content;
        this.user = user;
        this.ticket = ticket;
    }

    // Getters and Setters
    // ... (all getters/setters for each field)

    // toString()
    @Override
    public String toString() {
        return "Comment{" +
               "id=" + id +
               ", content='" + content + '\'' +
               ", user=" + (user != null ? user.getId() : null) +
               ", ticket=" + (ticket != null ? ticket.getId() : null) +
               ", createdAt=" + createdAt +
               '}';
    }
}
