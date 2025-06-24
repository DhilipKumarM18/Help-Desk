package com.helpdesk.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Security.JwtService;
import com.helpdesk.backend.Services.UserService;

import jakarta.servlet.http.HttpServletRequest;


public class UserController {

	@Autowired
	JwtService jwtService;
	
	@Autowired
	UserService userService;
	
	
	
}
