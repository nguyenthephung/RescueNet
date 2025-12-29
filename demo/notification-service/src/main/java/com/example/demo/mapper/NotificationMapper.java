package com.example.demo.mapper;


import com.example.demo.dto.request.NotificationRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.NotificationResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.Notification;
import com.example.demo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toNotification(NotificationRequest request);

    NotificationResponse toNotificationResponse(Notification request);
//    void updateUser(@MappingTarget User user, UserUpdateRequest request);

}
//    @Mapping(target = "roles", ignore = true)
//    void updateUser(@MappingTarget User user, UseUpdateRequest request);

