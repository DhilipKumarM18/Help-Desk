package com.helpdesk.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.helpdesk.backend.DTOS.LoginRequest;
import com.helpdesk.backend.DTOS.LoginResponse;
import com.helpdesk.backend.DTOS.RegisterRequest;
import com.helpdesk.backend.DTOS.UserResponse;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Security.JwtService;
import com.helpdesk.backend.Services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtService jwtService;



    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        String message = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }
    
    
    //login : endpoint: 
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword()
            )
        );

        User user = userService.getUserByEmail(loginRequest.getEmail());
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(new LoginResponse(token, user.getRole().name()));
    }
    
    
    @GetMapping("/me")
	public ResponseEntity<UserResponse> getCurrentUser(HttpServletRequest request) {
	    String token = request.getHeader("Authorization").substring(7);
	    String email = jwtService.extractUsername(token);
	    User user = userService.getUserByEmail(email);
	    UserResponse userResponse=new UserResponse(user);
	    
	    return ResponseEntity.ok(userResponse);   
	}


}
