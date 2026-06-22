package com.hirehub.services;

import com.hirehub.models.Job;
import com.hirehub.models.JobApplication;
import com.hirehub.models.SavedJob;
import com.hirehub.models.User;
import com.hirehub.repositories.JobApplicationRepository;
import com.hirehub.repositories.JobRepository;
import com.hirehub.repositories.SavedJobRepository;
import com.hirehub.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SavedJobRepository savedJobRepository;

    public ApplicationService(JobApplicationRepository applicationRepository, JobRepository jobRepository, UserRepository userRepository, SavedJobRepository savedJobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.savedJobRepository = savedJobRepository;
    }

    public List<JobApplication> getApplicationsForJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this job");
        }

        return applicationRepository.findByJobId(jobId);
    }

    public JobApplication updateApplicationStatus(Long applicationId, String status, String recruiterEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify the recruiter owns the job this application is for
        if (!application.getJob().getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized: You do not own the job for this application");
        }

        // Validate status
        if (!status.equals("SELECTED") && !status.equals("REJECTED") && !status.equals("PENDING")) {
            throw new RuntimeException("Invalid status. Must be SELECTED, REJECTED, or PENDING");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public JobApplication applyForJob(Long jobId, String candidateEmail, String resumeFileName) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.isVisible()) {
            throw new RuntimeException("This job is no longer accepting applications.");
        }

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Check if already applied
        boolean alreadyApplied = applicationRepository.findByCandidateId(candidate.getId())
                .stream()
                .anyMatch(app -> app.getJob().getId().equals(jobId));

        if (alreadyApplied) {
            throw new RuntimeException("You have already applied for this job!");
        }

        // Update Candidate's latest resume in their profile
        candidate.setResumePath(resumeFileName);
        userRepository.save(candidate);

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    public SavedJob saveJob(Long jobId, String candidateEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Check if already saved
        boolean alreadySaved = savedJobRepository.findByCandidateId(candidate.getId())
                .stream()
                .anyMatch(sj -> sj.getJob().getId().equals(jobId));

        if (alreadySaved) {
            throw new RuntimeException("You have already saved this job.");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setJob(job);
        savedJob.setCandidate(candidate);

        return savedJobRepository.save(savedJob);
    }

    public List<JobApplication> getMyApplications(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return applicationRepository.findByCandidateId(candidate.getId());
    }
}
