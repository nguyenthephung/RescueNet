package com.example.demo.mapper;

import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-25T22:16:29+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.userId( request.getUserId() );
        user.fullName( request.getFullName() );
        user.email( request.getEmail() );
        user.phone( request.getPhone() );
        user.passwordHash( request.getPasswordHash() );
        user.roleId( request.getRoleId() );
        user.status( request.getStatus() );
        user.createdAt( request.getCreatedAt() );

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.userId( user.getUserId() );
        userResponse.fullName( user.getFullName() );
        userResponse.passwordHash( user.getPasswordHash() );
        userResponse.email( user.getEmail() );
        userResponse.phone( user.getPhone() );
        userResponse.roleId( user.getRoleId() );
        userResponse.status( user.getStatus() );
        userResponse.createdAt( user.getCreatedAt() );

        return userResponse.build();
    }

    @Override
    public void updateUser(User user, UserUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        user.setFullName( request.getFullName() );
        user.setEmail( request.getEmail() );
        user.setPhone( request.getPhone() );
        user.setPasswordHash( request.getPasswordHash() );
    }
}
