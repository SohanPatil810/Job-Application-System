package com.hirehub.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT") // TEXT type allows for longer descriptions
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String category;

    @Column
    private String salary;

    @Column
    private String skills;

    @Column
    private String experience;

    @Column(nullable = false)
    private boolean isVisible = true; // By default, a new job is visible

    // Relationship: Many jobs can be created by One user (Recruiter)
    @ManyToOne(fetch = FetchType.LAZY) // LAZY loading: Only fetch the User from DB when we explicitly ask for it
    @JoinColumn(name = "recruiter_id", nullable = false) // Creates a Foreign Key column named 'recruiter_id'
    private User recruiter;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
