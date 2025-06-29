package com.helpdesk.backend.DTOS;

import com.helpdesk.backend.Entities.Ticket.Priority;
import com.helpdesk.backend.Entities.Ticket.Status;

public class UpdateTicketRequest {

	private Status status;
	private Priority priority;
	private Long assignedTo;
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public Priority getPriority() {
		return priority;
	}
	public void setPriority(Priority priority) {
		this.priority = priority;
	}
	public Long getAssignedTo() {
		return assignedTo;
	}
	public void setAssignedTo(Long assignedTo) {
		this.assignedTo = assignedTo;
	}
}
