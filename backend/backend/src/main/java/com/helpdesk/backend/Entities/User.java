package com.helpdesk.backend.Entities;



import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity      //table in database: user-table
@Table(name = "users")
public class User implements UserDetails {

	//2 roles for the user:
    public enum Role {
        CUSTOMER,  //can only apply the tickets:
        AGENT    //can assigned to tickets
    }

    @Id  //primary key:
    @GeneratedValue(strategy = GenerationType.IDENTITY)//auto incremented:
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at") //time-stamp:
    private LocalDateTime createdAt = LocalDateTime.now();

    //one user can create many tickets:
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private List<Ticket> createdTickets = new ArrayList<>();

    //one agent can be assigned to many tickets:
    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL)
    private List<Ticket> assignedTickets = new ArrayList<>();

    //one user can post many comments:
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    // Constructors
    public User() {}

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters:
    public Long getId() {
		return this.id; 
	}
    // ... (all getters/setters for each field)
    
    // toString()
    @Override
    public String toString() {
        return "User{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", email='" + email + '\'' +
               ", role=" + role +
               ", createdAt=" + createdAt +
               '}';
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

//	public String getPassword() {
//		return password;
//	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public List<Ticket> getCreatedTickets() {
		return createdTickets;
	}

	public List<Ticket> getAssignedTickets() {
		return assignedTickets;
	}

	public List<Comment> getComments() {
		return comments;
	}

    // Generate getters and setters using IDE or write manually
	
	

    // ✅ UserDetails methods implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
