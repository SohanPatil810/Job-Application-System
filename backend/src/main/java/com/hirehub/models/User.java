package com.hirehub.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data // Lombok: Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Lombok: Generates a no-argument constructor (required by Hibernate)
@AllArgsConstructor // Lombok: Generates an all-arguments constructor
@Entity // JPA: Marks this class as a database table
@Table(name = "users") // JPA: Specifies the table name in MySQL
public class User {

    @Id // JPA: Marks this field as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // JPA: Auto-increments the ID (1, 2, 3...)
    private Long id;

    @Column(nullable = false) // JPA: This column cannot be null in the database
    private String name;

    @Column(nullable = false, unique = true) // JPA: Email must be unique across the table
    private String email;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore // Prevent password from being sent to the frontend
    private String password;

    @Enumerated(EnumType.STRING) // JPA: Stores the Enum as a String ("ROLE_RECRUITER") instead of an integer
    @Column(nullable = false)
    private Role role;

    @CreationTimestamp // Hibernate: Automatically sets the current time when the row is created
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    // Additional Candidate fields could be in a separate Profile table or kept here for simplicity
    private String resumePath;
    private String location;
    private String bio;
}
