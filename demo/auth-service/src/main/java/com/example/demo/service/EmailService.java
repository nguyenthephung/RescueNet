package com.example.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendOtpEmail(String toEmail, String otpCode, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("RescueNet - Verification Code");

            String htmlContent = buildOtpEmailHtml(otpCode, userName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private String buildOtpEmailHtml(String otpCode, String userName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: %%23333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background: linear-gradient(135deg, %%23667eea 0%%, %%23764ba2 100%%);
                            border-radius: 10px;
                            padding: 30px;
                            color: white;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 32px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        .content {
                            background: white;
                            color: %%23333;
                            border-radius: 8px;
                            padding: 30px;
                            text-align: center;
                        }
                        .otp-code {
                            font-size: 36px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: %%23667eea;
                            padding: 20px;
                            background: %%23f3f4f6;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .warning {
                            color: %%23dc2626;
                            font-size: 14px;
                            margin-top: 20px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 12px;
                            color: rgba(255,255,255,0.8);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🚨 RescueNet</div>
                            <p>Emergency Response Platform</p>
                        </div>
                        
                        <div class="content">
                            <h2>Email Verification</h2>
                            <p>Hello <strong>%s</strong>,</p>
                            <p>Thank you for registering with RescueNet. Please use the following verification code to complete your registration:</p>
                            
                            <div class="otp-code">%s</div>
                            
                            <p>This code will expire in <strong>5 minutes</strong>.</p>
                            
                            <div class="warning">
                                ⚠️ If you didn't request this code, please ignore this email.
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>© 2025 RescueNet. All rights reserved.</p>
                            <p>This is an automated email, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(userName, otpCode);
    }
}
