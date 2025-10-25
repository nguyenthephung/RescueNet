package com.example.demo.mapper;

import com.example.demo.dto.request.ProfileCreationRequest;
import com.example.demo.dto.response.ProfileUserResponse;
import com.example.demo.model.ProfileUser;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-25T22:16:29+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class ProfileUserMapperImpl implements ProfileUserMapper {

    @Override
    public ProfileUser toProfileUser(ProfileCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        ProfileUser.ProfileUserBuilder profileUser = ProfileUser.builder();

        profileUser.userId( request.getUserId() );
        profileUser.username( request.getUsername() );
        profileUser.email( request.getEmail() );
        profileUser.phone( request.getPhone() );
        profileUser.firstName( request.getFirstName() );
        profileUser.lastName( request.getLastName() );
        profileUser.dob( request.getDob() );
        profileUser.city( request.getCity() );

        return profileUser.build();
    }

    @Override
    public ProfileUserResponse toProfileUserResponse(ProfileUser request) {
        if ( request == null ) {
            return null;
        }

        ProfileUserResponse.ProfileUserResponseBuilder profileUserResponse = ProfileUserResponse.builder();

        profileUserResponse.id( request.getId() );
        profileUserResponse.userId( request.getUserId() );
        profileUserResponse.username( request.getUsername() );
        profileUserResponse.email( request.getEmail() );
        profileUserResponse.phone( request.getPhone() );
        profileUserResponse.firstName( request.getFirstName() );
        profileUserResponse.lastName( request.getLastName() );
        profileUserResponse.dob( request.getDob() );
        profileUserResponse.city( request.getCity() );

        return profileUserResponse.build();
    }

    @Override
    public void update(ProfileUser entity, ProfileUserResponse request) {
        if ( request == null ) {
            return;
        }

        entity.setId( request.getId() );
        entity.setUserId( request.getUserId() );
        entity.setUsername( request.getUsername() );
        entity.setEmail( request.getEmail() );
        entity.setPhone( request.getPhone() );
        entity.setFirstName( request.getFirstName() );
        entity.setLastName( request.getLastName() );
        entity.setDob( request.getDob() );
        entity.setCity( request.getCity() );
    }
}
