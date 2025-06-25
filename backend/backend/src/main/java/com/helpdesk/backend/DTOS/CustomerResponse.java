package com.helpdesk.backend.DTOS;

import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Entities.User.Role;

public class CustomerResponse {
   
	private Long id;
	private String name;
	private String email;
	private Role role;
	
	public CustomerResponse(User user) {
		this.setEmail(user.getEmail());
		this.setId(user.getId());
		this.setName(user.getName());
		this.setRole(user.getRole());
	}
	
	

	public Role getRole() {
		return role;
	}



	public void setRole(Role role2) {
		this.role = role2;
	}



	//getters and setters:
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	
}
