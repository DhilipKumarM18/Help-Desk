package com.helpdesk.backend.DTOS;

import com.helpdesk.backend.Entities.User;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;

    // Constructor using User entity
    public UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole().toString(); // assuming Enum
    }

    // Getters only (no setters for immutability if you prefer)
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
