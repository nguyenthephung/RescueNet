package com.example.demo.mapper;


import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.User;
import com.example.demo.dto.request.UserCreationRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);
}
//    @Mapping(target = "roles", ignore = true)
//    void updateUser(@MappingTarget User user, UseUpdateRequest request);

