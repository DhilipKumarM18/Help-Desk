package com.helpdesk.backend.DTOS;

import com.helpdesk.backend.Entities.User;
 
public class UserResponse extends User{

	
	 public UserResponse(User user) {
		 super.setName(user.getName());
		 super.setEmail(user.getEmail());
		 super.setRole(user.getRole());
		 super.setCreatedTickets(user.getCreatedTickets());
		 super.setAssignedTickets(user.getAssignedTickets());
	 }
	 
}
	    
	    
	
