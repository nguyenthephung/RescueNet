package com.example.demo.service;

import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.model.OtpCode;
import com.example.demo.model.User;
import com.example.demo.repository.OtpRepository;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OtpService {

    OtpRepository otpRepository;
    UserRepository userRepository;
    EmailService emailService;
    
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final SecureRandom random = new SecureRandom();

    /**
     * Generate and send OTP to user
     */
    @Transactional
    public void generateAndSendOtp(String email, String userName) {
        // Mock SMS cho số điện thoại cụ thể
        if (email.equals("0123456789")) {
            log.info("Mock SMS: OTP code would be sent to phone: {}", email);
            // Vẫn generate OTP nhưng không gửi thật
            String otpCode = generateOtpCode();
            saveOtp(email, otpCode);
            log.info("Mock SMS OTP Code for {}: {}", email, otpCode);
            return;
        }

        // Generate OTP
        String otpCode = generateOtpCode();
        
        // Save to database
        saveOtp(email, otpCode);
        
        // Send email
        try {
            emailService.sendOtpEmail(email, otpCode, userName);
            log.info("OTP sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP to: {}", email, e);
            throw new AppException(ErrorCode.SEND_EMAIL_FAILED);
        }
    }

    /**
     * Verify OTP code
     */
    @Transactional
    public boolean verifyOtp(String email, String code) {
        OtpCode otpCode = otpRepository
                .findByEmailAndCodeAndVerifiedFalse(email, code)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));

        // Check if expired
        if (otpCode.isExpired()) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }

        // Check attempts
        if (otpCode.getAttempts() >= 5) {
            throw new AppException(ErrorCode.OTP_MAX_ATTEMPTS);
        }

        // Increment attempts
        otpCode.incrementAttempts();
        otpRepository.save(otpCode);

        // Verify code
        if (!otpCode.getCode().equals(code)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        // Mark as verified
        otpCode.setVerified(true);
        otpRepository.save(otpCode);

        // Update user status
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        user.setStatus("active");
        user.setEmailVerified(true);
        userRepository.save(user);

        log.info("OTP verified successfully for: {}", email);
        return true;
    }

    /**
     * Resend OTP
     */
    @Transactional
    public void resendOtp(String email) {
        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if already verified
        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new AppException(ErrorCode.USER_ALREADY_VERIFIED);
        }

        // Check last OTP time (prevent spam)
        otpRepository.findFirstByEmailAndVerifiedFalseOrderByCreatedAtDesc(email)
                .ifPresent(lastOtp -> {
                    if (lastOtp.getCreatedAt().plusMinutes(1).isAfter(LocalDateTime.now())) {
                        throw new AppException(ErrorCode.OTP_RESEND_TOO_SOON);
                    }
                });

        // Generate and send new OTP
        generateAndSendOtp(email, user.getFullName());
    }

    /**
     * Generate random 6-digit OTP
     */
    private String generateOtpCode() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Save OTP to database
     */
    private void saveOtp(String email, String code) {
        OtpCode otpCode = OtpCode.builder()
                .email(email)
                .code(code)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .verified(false)
                .attempts(0)
                .build();

        otpRepository.save(otpCode);
        log.info("OTP saved for email: {}", email);
    }

    /**
     * Clean expired OTPs (runs every hour)
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void cleanExpiredOtps() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("Expired OTPs cleaned");
    }
}
