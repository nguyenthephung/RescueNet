package com.example.demo.service;

import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.ProfileMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.httpclient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    ProfileClient profileClient;
    ProfileMapper profileMapper;
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public  User updateUser(Long userId,UserUpdateRequest request){
        User user = getUser(userId);
        userMapper.updateUser(user, request);
        return userRepository.save(user);
    }
    public UserResponse addUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

//        try {
//            user = userRepository.save(user);
//        } catch (DataIntegrityViolationException exception) {
//            throw new AppException(ErrorCode.USER_EXISTED);
//        }
        if(userRepository.existsByfullName(request.getFullName()))
            throw new AppException(ErrorCode.USER_EXISTED);
        user = userRepository.save(user);

        var profileRequest = profileMapper.toProfileCreationRequest(request);
        var profildeResponse = profileClient.createProfile((profileRequest));
        log.info((profildeResponse.toString()));
        return userMapper.toUserResponse(user);
    }
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
