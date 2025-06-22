package com.helpdesk.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.helpdesk.backend.DTOS.RegisterRequest;
import com.helpdesk.backend.Entities.User;
import com.helpdesk.backend.Entities.User.Role;
import com.helpdesk.backend.Repositories.UserRepository;

@Service
public class UserService {

	

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

  
    public String registerUser(RegisterRequest request) {
    	
    	//first check if already exist:
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        
        //not found : create a new user:
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);

        //save it in DB:
        userRepository.save(user);
        //return success message:
        return "User registered successfully";
}
    
    
    //finding the user through email:
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
}
