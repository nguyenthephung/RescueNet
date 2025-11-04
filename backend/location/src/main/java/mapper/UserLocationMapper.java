package mapper;

import org.springframework.stereotype.Component;
import dto.response.UserLocationResponse;
import model.UserLocation;

@Component
public class UserLocationMapper {

    public UserLocationResponse toResponse(UserLocation entity) {
        if (entity == null) return null;
        return new UserLocationResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getLatitude(),
                entity.getLongitude()
        );
    }
}
