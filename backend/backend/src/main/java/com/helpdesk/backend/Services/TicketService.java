package com.helpdesk.backend.Services;

import java.net.Authenticator.RequestorType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.helpdesk.backend.DTOS.CreateTicketRequest;
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
	private UserRepository userRepository;
	@Autowired
	private TicketRepository ticketRepository;
	

	//create a new ticket:
	public Ticket createTicket(CreateTicketRequest request, User customer) {
		
		Ticket ticket=new Ticket();
		//set the fields: 
	    ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        ticket.setStatus(Status.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setCreatedBy(customer);
		
        //save in db:
        
		return ticketRepository.save(ticket); 
	}


	
	//fetch all the tickets:
	public List<MyTicketsResponse> getTicketsByCustomer(User customer) {
	    List<Ticket> tickets = ticketRepository.findByCreatedBy(customer);

	    return tickets.stream()
	        .map(ticket -> new MyTicketsResponse( 
	            ticket.getId(),
	            ticket.getTitle(),
	            ticket.getDescription(),
	            ticket.getPriority(),
	            ticket.getStatus(),
	            ticket.getCreatedAt()
	        ))
	        .toList();
	}

    //fetch all the tickets:
	public List<MyTicketsResponse> getAllTickets(){
		
		List<Ticket>tickets=ticketRepository.findAll();
		
		 return tickets.stream()
			        .map(ticket -> new MyTicketsResponse( 
			            ticket.getId(),
			            ticket.getTitle(),
			            ticket.getDescription(), 
			            ticket.getPriority(),
			            ticket.getStatus(),
			            ticket.getCreatedAt() 
			        ))
			        .toList();
	}
	
	//find ticket by id:
	 public Ticket getTicketById(Long id) {
	        return ticketRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
	    }
	 
	//update ticket details: 
	public Ticket updateTicket(Long id,UpdateTicketRequest request) {
		
		  //fetch the ticket by id:
		  Ticket ticket = getTicketById(id);

	        if (request.getStatus() != null)
	            ticket.setStatus(request.getStatus());  

	        if (request.getPriority() != null) 
	            ticket.setPriority(request.getPriority());

	        if (request.getAssignedTo() != null) {
	            User agent = userRepository.findById(request.getAssignedTo())
	                    .orElseThrow(() -> new RuntimeException("Assigned agent not found"));
	            //assigning to a customer:
	            if(agent.getRole()== Role.CUSTOMER) {
	            	throw new RuntimeException("Customer can't be assigned to a ticket");
	            }
	            
	            
	            ticket.setAssignedTo(agent);
	        }

	        return ticketRepository.save(ticket); 
	}

    //delete a ticket:
	public void deleteTicket(Long id) {
		Ticket exist = getTicketById(id);
		
		
		
		ticketRepository.deleteById(id);
	}
}
