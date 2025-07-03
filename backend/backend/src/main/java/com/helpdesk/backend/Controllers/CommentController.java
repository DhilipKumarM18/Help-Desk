package com.helpdesk.backend.Controllers;

import com.helpdesk.backend.DTOS.CommentResponse;
import com.helpdesk.backend.DTOS.CreateCommentRequest;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Security.JwtService;
import com.helpdesk.backend.Services.CommentService;
import com.helpdesk.backend.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Base path for all APIs
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private JwtService jwtService; // To extract user info from JWT

    @Autowired
    private UserService userService; // To get User entity from email

    // Helper method to get the current authenticated user
    private User getCurrentUser(HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7); // Remove "Bearer " prefix
        String email = jwtService.extractUsername(token);
        return userService.getUserByEmail(email); // Assumes getUserByEmail throws if user not found
    }

    /**
     * CREATE Comment: POST /api/tickets/{ticketId}/comments
     * Allows authenticated users (CUSTOMER or AGENT) to add a comment to a ticket.
     */
    @PostMapping("/tickets/{ticketId}/comments")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT')")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @RequestBody CreateCommentRequest request,
            HttpServletRequest httpRequest) {
        try {
            User currentUser = getCurrentUser(httpRequest);
            CommentResponse response = commentService.addCommentToTicket(ticketId, request, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a custom error DTO
        }
    }

    /**
     * READ Comments: GET /api/tickets/{ticketId}/comments
     * Allows authenticated users (CUSTOMER or AGENT) to view all comments for a ticket.
     */
    @GetMapping("/tickets/{ticketId}/comments")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT')")
    public ResponseEntity<List<CommentResponse>> getCommentsByTicket(@PathVariable Long ticketId) {
        try {
            List<CommentResponse> comments = commentService.getCommentsForTicket(ticketId);
            return ResponseEntity.ok(comments);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or empty list, depending on desired behavior
        }
    }

    /**
     * READ Single Comment: GET /api/comments/{commentId}
     * Allows authenticated users (CUSTOMER or AGENT) to view a specific comment.
     * Note: Authorization logic might need to be refined if customers should only see comments on their own tickets.
     */
    @GetMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT')")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long commentId) {
        return commentService.getCommentById(commentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


    /**
     * UPDATE Comment: PUT /api/comments/{commentId}
     * Allows the owner of the comment (CUSTOMER or AGENT) to update their comment.
     */
    @PutMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT')")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @RequestBody CreateCommentRequest request, // Reusing DTO as it only contains content
            HttpServletRequest httpRequest) {
        try {
            User currentUser = getCurrentUser(httpRequest);
            CommentResponse updatedComment = commentService.updateComment(commentId, request, currentUser);
            return ResponseEntity.ok(updatedComment);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden
        }
    }

    /**
     * DELETE Comment: DELETE /api/comments/{commentId}
     * Allows the owner of the comment (CUSTOMER or AGENT) or any AGENT to delete a comment.
     */
    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT')") // Restrict further in service for owner/agent only
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            HttpServletRequest httpRequest) {
        try {
            User currentUser = getCurrentUser(httpRequest);
            commentService.deleteComment(commentId, currentUser);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204 No Content for successful deletion
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden
        }
    }
}