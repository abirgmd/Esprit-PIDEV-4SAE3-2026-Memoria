package com.med.cognitive.repository;

import com.med.cognitive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
    Optional<User> findByIdAndRole(Long id, String role);
    Optional<User> findByEmailAndPassword(String email, String password);
}
