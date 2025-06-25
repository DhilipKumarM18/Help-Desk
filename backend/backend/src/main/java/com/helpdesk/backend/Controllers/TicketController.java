package com.helpdesk.backend.Controllers;

import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.DTOS.TicketRequest;
import com.helpdesk.backend.Services.TicketService;
import com.helpdesk.backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

    // ✅ 1. Fetch all tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // ✅ 2. Create ticket (fixes 403)
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketRequest request, HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        Ticket created = ticketService.createTicket(request, token);
        return ResponseEntity.ok(created);
    }

    // ✅ 3. Assign ticket to agent
    @PutMapping("/{id}/assign")
    public ResponseEntity<String> assignTicket(@PathVariable Long id, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String agentEmail = userService.extractUsernameFromToken(token);
        ticketService.assignTicket(id, agentEmail);
        return ResponseEntity.ok("Ticket assigned to agent");
    }

    // ✅ 4. Close ticket
    @PutMapping("/{id}/close")
    public ResponseEntity<String> closeTicket(@PathVariable Long id) {
        ticketService.closeTicket(id);
        return ResponseEntity.ok("Ticket closed");
    }
}
