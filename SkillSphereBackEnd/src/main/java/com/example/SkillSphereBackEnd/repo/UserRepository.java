package com.example.SkillSphereBackEnd.repo;

import com.example.SkillSphereBackEnd.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email); // Find user by email
    boolean existsByEmail(String userName);
}
