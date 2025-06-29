package com.helpdesk.backend.DTOS;





import java.time.LocalDateTime;

import com.helpdesk.backend.Entities.Ticket.Priority;
import com.helpdesk.backend.Entities.Ticket.Status;



public class MyTicketsResponse {

    private Long id;
    private String title;
    private String description;
    private Priority priority; 
    private Status status;
    private LocalDateTime createdAt;

    public MyTicketsResponse() { 
    }

    public MyTicketsResponse(Long id, String title, String description,
                                Priority priority, Status status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
    }

    // ✅ Public Getters (required for JSON serialization)
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Priority getPriority() {
        return priority;
    }

    public Status getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
