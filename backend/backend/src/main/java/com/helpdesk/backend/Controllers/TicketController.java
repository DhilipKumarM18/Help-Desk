package com.helpdesk.backend.Controllers;

import java.net.ResponseCache;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.helpdesk.backend.DTOS.CreateTicketRequest;
import com.helpdesk.backend.DTOS.CreatedTicketResponse;
import com.helpdesk.backend.DTOS.MyTicketsResponse;
import com.helpdesk.backend.DTOS.UpdateTicketRequest;
import com.helpdesk.backend.Entities.Ticket;
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
	
	
	
	//api-endpoint 1 : 
	//create ticket endpoint: customer can create ticket:
	@PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<CreatedTicketResponse>createTicket(@RequestBody CreateTicketRequest request, HttpServletRequest httpRequest){
		    
		    //fetch the jwt token from header:
		    String token = httpRequest.getHeader("Authorization").substring(7);
		    //validate it and fetch user email:
	        String email = jwtService.extractUsername(token);
	        //fetch the user customer from email:
	        User customer=userService.getUserByEmail(email);
	        
	        //get the ticket:
	        Ticket createdTicket=ticketService.createTicket(request,customer);
	        
	        //create response entity:
	        CreatedTicketResponse response=new CreatedTicketResponse(createdTicket, customer);
	        
	        //send the response back:
	        return ResponseEntity.ok(response);   
	        
		
		
	}
	
	//api-endpoint 2:
	//fetch all tickets created by customer:
	@GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<MyTicketsResponse>> getMyTickets(HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User customer = userService.getUserByEmail(email);

        return ResponseEntity.ok(ticketService.getTicketsByCustomer(customer));  
    }

	
	//api-endpoint 3:
	//Agents view all tickets (add filters later):
    @GetMapping("/all")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<MyTicketsResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }
	
  //api-endpoint 4:
    // Agents update ticket status, priority, assignment
    @PutMapping("/{id}/update")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<CreatedTicketResponse> updateTicket(@PathVariable Long id,
                                               @RequestBody UpdateTicketRequest request) {
        Ticket updated = ticketService.updateTicket(id, request); 
        
        CreatedTicketResponse response=new CreatedTicketResponse(updated);
        
        return ResponseEntity.ok(response); 
    } 

  //api-endpoint 5:
    //fetch a specific ticket with id:
    @GetMapping("/{id}")
    public ResponseEntity<CreatedTicketResponse> getTicketById(@PathVariable Long id,
                                                HttpServletRequest httpRequest) {
    	//fetch the ticket:
        Ticket ticket = ticketService.getTicketById(id);

        //validate user from token
        String token = httpRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);

        // allow only if an agent or customer viewing it's own ticket:
        if (!user.getRole().name().equals("AGENT") &&
                !ticket.getCreatedBy().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        CreatedTicketResponse response=new CreatedTicketResponse(ticket);
        		
        return ResponseEntity.ok(response);
    }
	
	 
  //api-endpoint 6:
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENT')")
    public String deleteTicketById(@PathVariable Long id) {
    	
    	ticketService.deleteTicket(id);
    	
    	return "Deleted successfully...";
    }
	
	
	
	
	
	
	
}
