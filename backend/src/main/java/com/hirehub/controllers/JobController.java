package com.hirehub.controllers;

import com.hirehub.dto.JobRequest;
import com.hirehub.models.Job;
import com.hirehub.services.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // 1. Add Job (Recruiter Only)
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<Job> addJob(@Valid @RequestBody JobRequest request, Authentication authentication) {
        String recruiterEmail = authentication.getName();
        return ResponseEntity.ok(jobService.addJob(request, recruiterEmail));
    }

    // 2. Manage Jobs / Get All Jobs by Recruiter (Recruiter Only)
    @GetMapping("/my-jobs")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<List<Job>> getMyJobs(Authentication authentication) {
        String recruiterEmail = authentication.getName();
        return ResponseEntity.ok(jobService.getJobsByRecruiter(recruiterEmail));
    }

    // 3. Edit Job (Recruiter Only)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<Job> editJob(@PathVariable Long id, @Valid @RequestBody JobRequest request, Authentication authentication) {
        String recruiterEmail = authentication.getName();
        return ResponseEntity.ok(jobService.updateJob(id, request, recruiterEmail));
    }

    // 4. Delete Job (Recruiter Only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<String> deleteJob(@PathVariable Long id, Authentication authentication) {
        String recruiterEmail = authentication.getName();
        jobService.deleteJob(id, recruiterEmail);
        return ResponseEntity.ok("Job deleted successfully");
    }

    // 5. Toggle Visibility (Recruiter Only)
    @PatchMapping("/{id}/toggle-visibility")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<Job> toggleVisibility(@PathVariable Long id, Authentication authentication) {
        String recruiterEmail = authentication.getName();
        return ResponseEntity.ok(jobService.toggleVisibility(id, recruiterEmail));
    }
}
