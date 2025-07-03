package com.helpdesk.backend.DTOS;

import com.helpdesk.backend.Entities.Comment;
import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private CustomerResponse user; // Reusing CustomerResponse for the user who made the comment

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.user = new CustomerResponse(comment.getUser());
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public CustomerResponse getUser() {
        return user;
    }
}