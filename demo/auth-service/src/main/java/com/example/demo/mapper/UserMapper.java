package com.example.demo.mapper;


import com.example.demo.dto.response.RoleResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    @Mapping(source = "userId", target = "userId", qualifiedByName = "longToString")
    UserResponse toUserResponse(User user);
//    RoleResponse toRoleResponse(Role role);
//    default Set<RoleResponse> mapRoles(Set<Role> roles) {
//        return roles.stream()
//                .map(this::toRoleResponse)
//                .collect(Collectors.toSet());
//    }
    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
    @Named("longToString")
    static String longToString(Long userId) {
        return userId != null ? userId.toString() : null;
    }
}
//    @Mapping(target = "roles", ignore = true)
//    void updateUser(@MappingTarget User user, UseUpdateRequest request);

