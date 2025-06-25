package com.helpdesk.backend.DTOS;

import com.helpdesk.backend.Entities.Ticket;

public class TicketRequest {
    private String title;
    private String description;
    private Ticket.Priority priority;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Ticket.Priority getPriority() {
        return priority;
    }

    public void setPriority(Ticket.Priority priority) {
        this.priority = priority;
    }
}
