package com.helpdesk.backend.Entities;



import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity //table in database:
@Table(name = "tickets")
public class Ticket {

	//enum:
    public enum Status {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        CLOSED
    }

    //enum:
    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }

    @Id //primary key:
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
 
    public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

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

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public User getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(User assignedTo) {
		this.assignedTo = assignedTo;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    //one ticket created by one user:
    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    //one ticket assigned to one agent:
    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    //time-stamp
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    //one ticket can have many comments:
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    // Constructors
    public Ticket() {}

    public Ticket(String title, String description, User createdBy) {
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    
    public Long getId() { 
    	return this.id;
    }
    // ... (all getters/setters for each field)

    // toString()
    @Override
    public String toString() {
        return "Ticket{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", status=" + status +
               ", priority=" + priority +
               ", createdBy=" + (createdBy != null ? createdBy.getId() : null) +
               ", assignedTo=" + (assignedTo != null ? assignedTo.getId() : null) +
               ", createdAt=" + createdAt +
               '}';
    }
}
