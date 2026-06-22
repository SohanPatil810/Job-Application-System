package com.hirehub.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    // Any authenticated user can access this
    @GetMapping("/protected")
    public String protectedRoute() {
        return "You are authenticated!";
    }

    // Only Recruiters can access this
    @GetMapping("/recruiter")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public String recruiterOnly() {
        return "Welcome, Recruiter! You have access to this endpoint.";
    }

    // Only Candidates can access this
    @GetMapping("/candidate")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public String candidateOnly() {
        return "Welcome, Candidate! You have access to this endpoint.";
    }
}
