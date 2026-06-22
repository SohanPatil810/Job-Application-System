package com.hirehub.repositories;

import com.hirehub.models.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    // Find all applications submitted by a specific candidate
    List<JobApplication> findByCandidateId(Long candidateId);

    // Find all applications for a specific job (useful for recruiters)
    List<JobApplication> findByJobId(Long jobId);
}
