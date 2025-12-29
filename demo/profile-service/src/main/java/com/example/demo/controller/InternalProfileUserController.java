package com.example.demo.controller;

import com.example.demo.dto.request.ApiResponse;
import com.example.demo.dto.request.ProfileCreationRequest;
import com.example.demo.dto.response.ProfileUserResponse;
import com.example.demo.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalProfileUserController {
    UserProfileService userProfileService;

    @PostMapping("/internal/create")
    ProfileUserResponse creatProfile(@RequestBody ProfileCreationRequest request){
        return userProfileService.createProfile(request);
    }
    @GetMapping("/internal/users/{userId}")
    ApiResponse<ProfileUserResponse> getProfile(@PathVariable String userId) {
        return ApiResponse.<ProfileUserResponse>builder()
                .result(userProfileService.getByUserId(userId))
                .build();
    }
}
