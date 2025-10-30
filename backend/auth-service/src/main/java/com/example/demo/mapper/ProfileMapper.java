package com.example.demo.mapper;

import com.example.demo.dto.request.ProfileCreationRequest;
import com.example.demo.dto.request.UserCreationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(source = "fullName", target = "username")
    @Mapping(source = "userId", target = "userId", qualifiedByName = "longToString")
    ProfileCreationRequest toProfileCreationRequest(UserCreationRequest request);
    @Named("longToString")
    static String longToString(Long userId) {
        return userId != null ? userId.toString() : null;
    }
}
