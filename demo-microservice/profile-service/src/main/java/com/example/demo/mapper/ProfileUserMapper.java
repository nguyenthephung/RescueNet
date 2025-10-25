package com.example.demo.mapper;

import com.example.demo.dto.request.ProfileCreationRequest;
import com.example.demo.dto.response.ProfileUserResponse;
import com.example.demo.model.ProfileUser;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface ProfileUserMapper {
    ProfileUser toProfileUser(ProfileCreationRequest request);
    ProfileUserResponse toProfileUserResponse(ProfileUser request);
    void update(@MappingTarget ProfileUser entity, ProfileUserResponse request);


}
