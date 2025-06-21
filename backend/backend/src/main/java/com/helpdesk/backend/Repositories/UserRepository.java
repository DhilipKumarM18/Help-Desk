package com.helpdesk.backend.Repositories;



import org.springframework.data.jpa.repository.JpaRepository;

import com.helpdesk.backend.Entities.User;

import java.util.Optional;


//find User entity based on email:
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
