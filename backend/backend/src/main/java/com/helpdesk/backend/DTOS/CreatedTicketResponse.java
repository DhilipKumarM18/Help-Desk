package com.helpdesk.backend.DTOS;

import java.sql.Date;
import java.time.LocalDateTime;

import com.helpdesk.backend.Entities.Ticket;
import com.helpdesk.backend.Entities.Ticket.Priority;
import com.helpdesk.backend.Entities.Ticket.Status;
import com.helpdesk.backend.Entities.User;

public class CreatedTicketResponse {

	
	private Long  id;
	private String title;
	private String description;
	private Priority priority;
	private Status status;
	private LocalDateTime createdAt;
	private CustomerResponse createdBy;
	private CustomerResponse assignedTo; 
	 
	//1st constructor:
	public CreatedTicketResponse(Ticket ticket,User user) {
		this.id=ticket.getId();
		this.title=ticket.getTitle();
		this.description=ticket.getDescription();
		this.priority=ticket.getPriority();
		this.status=ticket.getStatus();
		this.createdAt=ticket.getCreatedAt();
		this.createdBy=new CustomerResponse(user);
		this.assignedTo=null;
		
		
	}
	
	//2nd constructor:
	public CreatedTicketResponse(Ticket ticket) {
		this.id=ticket.getId();
		this.title=ticket.getTitle();
		this.description=ticket.getDescription();
		this.priority=ticket.getPriority();
		this.status=ticket.getStatus();
		this.createdAt=ticket.getCreatedAt();
		this.createdBy=new CustomerResponse(ticket.getCreatedBy());
		
		this.assignedTo= (ticket.getAssignedTo()==null)?null:new CustomerResponse(ticket.getAssignedTo());
		
		
	}
	
	

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Priority getPriority() {
        return priority;
    }

    public Status getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public CustomerResponse getCreatedBy() {
        return createdBy;
    }

    public CustomerResponse getAssignedTo() {
        return assignedTo; 
    }
	 
	
	
}
