package com.helpdesk.backend.DTOS;

public class CreateTicketRequest {

	
	private String title;
	private String description;
	private String priority;
	
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String tittle) {
		this.title = tittle;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
}
