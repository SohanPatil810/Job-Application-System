package com.hirehub.controllers;

import com.hirehub.models.JobApplication;
import com.hirehub.services.ApplicationService;
import com.hirehub.services.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final ApplicationService applicationService;
    private final FileStorageService fileStorageService;

    public CandidateController(ApplicationService applicationService, FileStorageService fileStorageService) {
        this.applicationService = applicationService;
        this.fileStorageService = fileStorageService;
    }

    // Candidate applies for a job and uploads resume
    @PostMapping("/jobs/{jobId}/apply")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<JobApplication> applyForJob(
            @PathVariable Long jobId,
            @RequestParam("resume") MultipartFile resume,
            Authentication authentication) {

        String candidateEmail = authentication.getName();

        // 1. Store the file locally
        String fileName = fileStorageService.storeFile(resume);

        // 2. Create the application
        JobApplication application = applicationService.applyForJob(jobId, candidateEmail, fileName);

        return ResponseEntity.ok(application);
    }

    // Candidate saves a job
    @PostMapping("/jobs/{jobId}/save")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<?> saveJob(@PathVariable Long jobId, Authentication authentication) {
        String candidateEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.saveJob(jobId, candidateEmail));
    }

    // Candidate views their applications
    @GetMapping("/applications")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<java.util.List<JobApplication>> getMyApplications(Authentication authentication) {
        String candidateEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.getMyApplications(candidateEmail));
    }
}
