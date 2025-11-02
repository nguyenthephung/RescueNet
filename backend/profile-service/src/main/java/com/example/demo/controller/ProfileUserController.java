package com.example.demo.controller;

import com.example.demo.dto.request.ApiResponse;
import com.example.demo.dto.request.ProfileCreationRequest;
import com.example.demo.dto.response.ProfileUserResponse;
import com.example.demo.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileUserController {
    UserProfileService userProfileService;
    @GetMapping ("/{profileId}")
    ProfileUserResponse getProfile(@PathVariable String profileId){
        return userProfileService.getProfile(profileId);
    }
    @GetMapping("/users")
    ApiResponse<List<ProfileUserResponse>> getAllProfiles() {
        return ApiResponse.<List<ProfileUserResponse>>builder()
                .result(userProfileService.getAllProfiles())
                .build();
    }

}

