package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.dto.response.AuthenticationResponse;
import com.example.demo.dto.response.IntrospectResponse;
import com.example.demo.service.AuthenticationService;
import com.example.demo.service.OtpService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@Builder
@RestController
//@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    OtpService otpService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authentication(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();

    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();

    }
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
       authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();

    }

    @PostMapping("/verify")
    ApiResponse<String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getCode());
        return ApiResponse.<String>builder()
                .result("Email verified successfully")
                .build();
    }

    @PostMapping("/resend-code")
    ApiResponse<String> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        otpService.resendOtp(request.getEmail());
        return ApiResponse.<String>builder()
                .result("Verification code sent successfully")
                .build();
    }
}