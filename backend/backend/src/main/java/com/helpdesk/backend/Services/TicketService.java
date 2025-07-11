package com.helpdesk.backend.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.helpdesk.backend.DTOS.CreateTicketRequest;
import com.helpdesk.backend.DTOS.CreatedTicketResponse;
import com.helpdesk.backend.DTOS.MyTicketsResponse;
import com.helpdesk.backend.DTOS.UpdateTicketRequest;
import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.Entities.Ticket.Priority;
import com.helpdesk.backend.Entities.Ticket.Status;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Entities.User.Role;
import com.helpdesk.backend.Repositories.TicketRepository;
import com.helpdesk.backend.Repositories.UserRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Create a new ticket
    public Ticket createTicket(CreateTicketRequest request, User customer) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        ticket.setStatus(Status.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setCreatedBy(customer);
        return ticketRepository.save(ticket);
    }

    // ✅ Fetch all tickets created by a specific customer
    public List<MyTicketsResponse> getTicketsByCustomer(User customer) {
        List<Ticket> tickets = ticketRepository.findByCreatedBy(customer);
        return tickets.stream().map(ticket ->
            new MyTicketsResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedAt()
            )
        ).toList();
    }

    // ✅ Fetch all tickets (for agents)
    public List<MyTicketsResponse> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return tickets.stream().map(ticket ->
            new MyTicketsResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedAt()
            )
        ).toList();
    }

    // ✅ Fetch a ticket by ID
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    // ✅ Update a ticket (status, priority, assigned agent)
    public Ticket updateTicket(Long id, UpdateTicketRequest request) {
        Ticket ticket = getTicketById(id);

        if (request.getStatus() != null)
            ticket.setStatus(request.getStatus());

        if (request.getPriority() != null)
            ticket.setPriority(request.getPriority());

        if (request.getAssignedTo() != null) {
            User agent = userRepository.findById(request.getAssignedTo())
                    .orElseThrow(() -> new RuntimeException("Assigned agent not found"));

            if (agent.getRole() == Role.CUSTOMER) {
                throw new RuntimeException("Customer cannot be assigned to a ticket");
            }

            ticket.setAssignedTo(agent);
        }

        return ticketRepository.save(ticket);
    }

    // ✅ Delete a ticket
    public void deleteTicket(Long id) {
        Ticket exist = getTicketById(id);
        ticketRepository.deleteById(id);
    }

    // ✅ Filter tickets (agent-specific)
    public List<CreatedTicketResponse> filterTickets(Status status,
                                                     Priority priority,
                                                     Long assignedTo,
                                                     LocalDate startDate,
                                                     LocalDate endDate) {
        LocalDateTime from = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime to = (endDate != null) ? endDate.atTime(23, 59, 59) : null;

        List<Ticket> tickets = ticketRepository.filterTickets(status, priority, assignedTo, from, to);

        return tickets.stream()
                .map(CreatedTicketResponse::new)
                .toList();
    }

    // ✅ Search tickets by title (case-insensitive)
    public List<Ticket> searchTicketsByTitle(String keyword) {
        return ticketRepository.searchByTitle(keyword);
    }
}
