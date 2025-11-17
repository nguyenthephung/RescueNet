package com.example.demo.service;

import com.example.demo.dto.request.ApiResponse;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.enums.Role;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.ProfileMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.httpclient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashSet;
import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    ProfileClient profileClient;
    ProfileMapper profileMapper;
    RoleRepository roleRepository;
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }
    @PostAuthorize("returnObject.fullName == authentication.name")
    public  UserResponse updateUser(Long userId,UserUpdateRequest request){
        User user = getUser(userId);
        userMapper.updateUser(user, request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
        log.info("Requested roles: {}", request.getRoles());
        var roles = roleRepository.findByNameInWithPermissions(request.getRoles());
        roles.forEach(role -> role.getPermissions().size());
        log.info("list roles: {}",roles.toString());
        user.setRoles(new HashSet<>(roles));
        UserResponse response = userMapper.toUserResponse(user);

        // Lưu user
        userRepository.save(user);

        return response;
    }
    public UserResponse addUser(UserCreationRequest request) {
        log.info("add user");
        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

//        try {
//            user = userRepository.save(user);
//        } catch (DataIntegrityViolationException exception) {
//            throw new AppException(ErrorCode.USER_EXISTED);
//        }
        HashSet<String> roles = new HashSet<>();
//        roles.add(Role.USER.name());
//        user.setRoles(roles);
        if(userRepository.existsByfullName(request.getFullName()))
            throw new AppException(ErrorCode.USER_EXISTED);
        user = userRepository.save(user);

        var profileRequest = profileMapper.toProfileCreationRequest(request);
        var profildeResponse = profileClient.createProfile((profileRequest));
        log.info((profildeResponse.toString()));
        return userMapper.toUserResponse(user);
    }
    public UserResponse getMyInfo (){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByFullNameWithRoles(name).orElseThrow(()->new AppException(ErrorCode.USER_EXISTED));
        return userMapper.toUserResponse(user);
    }
    @PreAuthorize("hasRole('ADMIN')")
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

}
