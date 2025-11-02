package com.example.demo.repository;

import com.example.demo.model.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpCode, Long> {
    
    Optional<OtpCode> findByEmailAndCodeAndVerifiedFalse(String email, String code);
    
    Optional<OtpCode> findFirstByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);
    
    void deleteByEmailAndExpiresAtBefore(String email, LocalDateTime dateTime);
    
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
