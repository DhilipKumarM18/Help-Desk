package com.helpdesk.backend.Services;

import com.helpdesk.backend.DTOS.CommentResponse;
import com.helpdesk.backend.DTOS.CreateCommentRequest;
import com.helpdesk.backend.Entities.Comment;
import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // For transactional operations
import jakarta.persistence.EntityNotFoundException; // For handling not found entities

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketService ticketService; // To fetch the ticket

    @Autowired
    private UserService userService; // To fetch the user

    /**
     * CREATE Operation: Adds a new comment to a specific ticket.
     * @param ticketId The ID of the ticket to which the comment will be added.
     * @param request The DTO containing the content of the comment.
     * @param currentUser The user creating the comment (extracted from JWT).
     * @return CommentResponse DTO of the created comment.
     */
    @Transactional
    public CommentResponse addCommentToTicket(Long ticketId, CreateCommentRequest request, User currentUser) {
        // Ensure the ticket exists
        Ticket ticket = ticketService.getTicketById(ticketId); // This method should throw an exception if not found

        // Create the new comment
        Comment comment = new Comment(request.getContent(), currentUser, ticket);
        Comment savedComment = commentRepository.save(comment);
        return new CommentResponse(savedComment);
    }

    /**
     * READ Operation: Retrieves a single comment by its ID.
     * @param commentId The ID of the comment to retrieve.
     * @return Optional of CommentResponse DTO if found, empty otherwise.
     */
    public Optional<CommentResponse> getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .map(CommentResponse::new);
    }

    /**
     * READ Operation: Retrieves all comments for a specific ticket.
     * @param ticketId The ID of the ticket whose comments are to be retrieved.
     * @return List of CommentResponse DTOs.
     */
    public List<CommentResponse> getCommentsForTicket(Long ticketId) {
        // Ensure the ticket exists (optional, depends on whether you want to return 404 for non-existent tickets)
        Ticket ticket = ticketService.getTicketById(ticketId); // This method should throw an exception if not found

        List<Comment> comments = commentRepository.findByTicket(ticket);
        return comments.stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * UPDATE Operation: Updates an existing comment.
     * @param commentId The ID of the comment to update.
     * @param request The DTO containing the new content for the comment.
     * @param currentUser The user attempting to update the comment.
     * @return CommentResponse DTO of the updated comment.
     * @throws SecurityException if the current user is not the owner of the comment.
     * @throws EntityNotFoundException if the comment with the given ID is not found.
     */
    @Transactional
    public CommentResponse updateComment(Long commentId, CreateCommentRequest request, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + commentId));

        // Authorization check: Only the owner of the comment can update it
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("User is not authorized to update this comment.");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return new CommentResponse(updatedComment);
    }

    /**
     * DELETE Operation: Deletes a comment by its ID.
     * @param commentId The ID of the comment to delete.
     * @param currentUser The user attempting to delete the comment.
     * @throws SecurityException if the current user is not the owner of the comment or an agent.
     * @throws EntityNotFoundException if the comment with the given ID is not found.
     */
    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + commentId));

        // Authorization check: Only the owner or an AGENT can delete a comment
        if (!comment.getUser().getId().equals(currentUser.getId()) && !currentUser.getRole().equals(User.Role.AGENT)) {
            throw new SecurityException("User is not authorized to delete this comment.");
        }

        commentRepository.delete(comment);
    }
}