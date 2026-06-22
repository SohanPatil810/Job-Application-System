package com.hirehub.controllers;

import com.hirehub.models.Job;
import com.hirehub.repositories.JobRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/jobs")
public class PublicJobController {

    private final JobRepository jobRepository;

    public PublicJobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllVisibleJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category) {

        List<Job> jobs = jobRepository.findByIsVisibleTrue();

        if (keyword != null && !keyword.trim().isEmpty()) {
            String lowerKeyword = keyword.toLowerCase();
            jobs = jobs.stream()
                    .filter(j -> j.getTitle().toLowerCase().contains(lowerKeyword) || 
                                 j.getDescription().toLowerCase().contains(lowerKeyword))
                    .collect(Collectors.toList());
        }

        if (location != null && !location.trim().isEmpty()) {
            String lowerLocation = location.toLowerCase();
            jobs = jobs.stream()
                    .filter(j -> j.getLocation().toLowerCase().contains(lowerLocation))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.trim().isEmpty()) {
            jobs = jobs.stream()
                    .filter(j -> j.getCategory().equalsIgnoreCase(category.trim()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(jobs);
    }
}
