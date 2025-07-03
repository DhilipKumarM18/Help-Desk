package com.helpdesk.backend.DTOS;

public class CreateCommentRequest {
    private String content;
    // You might consider adding a ticketId here if the endpoint doesn't include it in the path
    // For this implementation, we'll assume ticketId is part of the URL path.

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}