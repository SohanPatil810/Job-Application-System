package com.hirehub.repositories;

import com.hirehub.models.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    // Find all jobs saved by a specific candidate
    List<SavedJob> findByCandidateId(Long candidateId);
}
