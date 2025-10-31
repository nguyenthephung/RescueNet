package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByfullName(String fullName);
    boolean existsByEmail(String email);
    Optional<User> findByfullName(String fullName);
    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permissions WHERE u.fullName = :name")
    Optional<User> findByFullNameWithRoles(@Param("name") String name);
}
