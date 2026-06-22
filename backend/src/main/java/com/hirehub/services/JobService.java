package com.hirehub.services;

import com.hirehub.dto.JobRequest;
import com.hirehub.models.Job;
import com.hirehub.models.User;
import com.hirehub.repositories.JobRepository;
import com.hirehub.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Job addJob(JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setCategory(request.getCategory());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setExperience(request.getExperience());
        job.setRecruiter(recruiter);
        job.setVisible(true);

        return jobRepository.save(job);
    }

    public List<Job> getJobsByRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByRecruiterId(recruiter.getId());
    }

    public Job updateJob(Long jobId, JobRequest request, String recruiterEmail) {
        Job job = getJobIfOwnedByRecruiter(jobId, recruiterEmail);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setCategory(request.getCategory());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setExperience(request.getExperience());

        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId, String recruiterEmail) {
        Job job = getJobIfOwnedByRecruiter(jobId, recruiterEmail);
        jobRepository.delete(job);
    }

    public Job toggleVisibility(Long jobId, String recruiterEmail) {
        Job job = getJobIfOwnedByRecruiter(jobId, recruiterEmail);
        job.setVisible(!job.isVisible());
        return jobRepository.save(job);
    }

    // Helper method to ensure a recruiter only edits/deletes their own jobs
    private Job getJobIfOwnedByRecruiter(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this job");
        }
        return job;
    }
}
