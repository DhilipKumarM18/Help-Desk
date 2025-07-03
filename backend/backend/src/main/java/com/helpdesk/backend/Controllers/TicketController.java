package com.helpdesk.backend.Controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.helpdesk.backend.DTOS.CreateTicketRequest;
import com.helpdesk.backend.DTOS.CreatedTicketResponse;
import com.helpdesk.backend.DTOS.MyTicketsResponse;
import com.helpdesk.backend.DTOS.UpdateTicketRequest;
import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.Entities.Ticket.Priority;
import com.helpdesk.backend.Entities.Ticket.Status;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Security.JwtService;
import com.helpdesk.backend.Services.TicketService;
import com.helpdesk.backend.Services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private TicketService ticketService;

    // 1️⃣ Create Ticket (CUSTOMER only)
    @PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CreatedTicketResponse> createTicket(@RequestBody CreateTicketRequest request, HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User customer = userService.getUserByEmail(email);

        Ticket createdTicket = ticketService.createTicket(request, customer);
        CreatedTicketResponse response = new CreatedTicketResponse(createdTicket, customer);

        return ResponseEntity.ok(response);
    }

    // 2️⃣ Get Tickets created by current CUSTOMER
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<MyTicketsResponse>> getMyTickets(HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User customer = userService.getUserByEmail(email);

        return ResponseEntity.ok(ticketService.getTicketsByCustomer(customer));
    }

    // 3️⃣ Get all tickets (AGENT only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<MyTicketsResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // 4️⃣ Update ticket (AGENT only)
    @PutMapping("/{id}/update")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<CreatedTicketResponse> updateTicket(@PathVariable Long id,
                                                              @RequestBody UpdateTicketRequest request) {
        Ticket updated = ticketService.updateTicket(id, request);
        CreatedTicketResponse response = new CreatedTicketResponse(updated);
        return ResponseEntity.ok(response);
    }

    // 5️⃣ Get ticket by ID (CUSTOMER sees their own, AGENT sees all)
    @GetMapping("/{id}")
    public ResponseEntity<CreatedTicketResponse> getTicketById(@PathVariable Long id, HttpServletRequest httpRequest) {
        Ticket ticket = ticketService.getTicketById(id);

        String token = httpRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);

        if (!user.getRole().name().equals("AGENT") &&
            !ticket.getCreatedBy().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        CreatedTicketResponse response = new CreatedTicketResponse(ticket);
        return ResponseEntity.ok(response);
    }

    // 6️⃣ Delete ticket (AGENT only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENT')")
    public String deleteTicketById(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return "Deleted successfully...";
    }

    // 7️⃣ Filter tickets (AGENT only)
    @GetMapping("/filter")
    // @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<CreatedTicketResponse>> filterTickets(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<CreatedTicketResponse> filtered = ticketService.filterTickets(status, priority, assignedTo, startDate, endDate);
        return ResponseEntity.ok(filtered);
    }
}
