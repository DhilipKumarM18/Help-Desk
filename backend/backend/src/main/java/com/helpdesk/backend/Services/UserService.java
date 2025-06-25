package com.helpdesk.backend.Services;

import com.helpdesk.backend.DTOS.RegisterRequest;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Repositories.UserRepository;
import com.helpdesk.backend.Security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔹 Register user
    public String registerUser(RegisterRequest request) {
        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("Email already registered.");
        }

        User newUser = new User(
            request.getName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            User.Role.CUSTOMER
        );

        userRepository.save(newUser);
        return "User registered successfully";
    }

    // 🔹 Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // 🔹 Extract email from JWT token
    public String extractUsernameFromToken(String token) {
        return jwtService.extractUsername(token);
    }

}
