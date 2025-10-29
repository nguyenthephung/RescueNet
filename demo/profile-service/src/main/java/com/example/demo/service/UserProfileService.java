package com.example.demo.service;

import com.example.demo.dto.request.ProfileCreationRequest;
import com.example.demo.dto.response.ProfileUserResponse;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.ProfileUserMapper;
import com.example.demo.model.ProfileUser;
import com.example.demo.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional
public class UserProfileService {
    UserProfileRepository userProfileRepository;
//    FileClient fileClient;

    ProfileUserMapper userProfileMapper;

    public ProfileUserResponse createProfile(ProfileCreationRequest request) {
        ProfileUser userProfile = userProfileMapper.toProfileUser(request);
        log.info("Saving profile: {}", userProfile);
        userProfile = userProfileRepository.save(userProfile);
        log.info("Saved profile with id: {}", userProfile.getId());
        return userProfileMapper.toProfileUserResponse(userProfile);
    }
    public ProfileUserResponse getProfile(String id) {
        ProfileUser userProfile =
                userProfileRepository.findById(id).orElseThrow(
                        () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toProfileUserResponse(userProfile);
    }
}
