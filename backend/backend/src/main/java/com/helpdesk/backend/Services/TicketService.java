package com.helpdesk.backend.Services;

import com.helpdesk.backend.DTOS.TicketRequest;
import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Repositories.TicketRepository;
import com.helpdesk.backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket createTicket(TicketRequest request, String customerEmail) {
        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(Ticket.Status.OPEN);
        ticket.setCreatedBy(user);

        return ticketRepository.save(ticket);
    }

    public void assignTicket(Long ticketId, String agentEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        ticket.setAssignedTo(agent);
        ticket.setStatus(Ticket.Status.ASSIGNED);
        ticketRepository.save(ticket);
    }

    public void closeTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(Ticket.Status.CLOSED);
        ticketRepository.save(ticket);
    }
}
