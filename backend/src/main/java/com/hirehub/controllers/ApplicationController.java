package com.hirehub.controllers;

import com.hirehub.models.JobApplication;
import com.hirehub.services.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import com.hirehub.models.JobApplication;
import com.hirehub.services.ApplicationService;
import com.hirehub.services.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final FileStorageService fileStorageService;

    public ApplicationController(ApplicationService applicationService, FileStorageService fileStorageService) {
        this.applicationService = applicationService;
        this.fileStorageService = fileStorageService;
    }

    // 6. View applications for a specific job (Recruiter Only)
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<List<JobApplication>> getApplicationsForJob(@PathVariable Long jobId, Authentication authentication) {
        String recruiterEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, recruiterEmail));
    }

    // 7 & 8. Select or Reject candidate (Update status) (Recruiter Only)
    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<JobApplication> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> requestBody,
            Authentication authentication) {
        
        String recruiterEmail = authentication.getName();
        String status = requestBody.get("status");
        
        if (status == null) {
            throw new RuntimeException("Status is required");
        }

        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status.toUpperCase(), recruiterEmail));
    }

    // 9. Download / View Resume (Recruiter Only)
    @GetMapping("/download-resume/{fileName}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        
        // Try to determine file's content type
        String contentType = "application/octet-stream";
        if(fileName.toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf";
        } else if(fileName.toLowerCase().endsWith(".docx")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
