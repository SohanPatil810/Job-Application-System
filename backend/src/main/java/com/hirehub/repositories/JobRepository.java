package com.hirehub.repositories;

import com.hirehub.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // Find all jobs created by a specific recruiter
    List<Job> findByRecruiterId(Long recruiterId);
    
    // Find all visible jobs
    List<Job> findByIsVisibleTrue();
}
