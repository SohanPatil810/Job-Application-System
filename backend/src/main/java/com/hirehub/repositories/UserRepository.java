package com.hirehub.repositories;

import com.hirehub.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA will automatically generate the SQL query for this method based on its name!
    Optional<User> findByEmail(String email);
}
