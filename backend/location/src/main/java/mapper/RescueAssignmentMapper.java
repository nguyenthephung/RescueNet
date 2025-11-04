package mapper;

import org.springframework.stereotype.Component;
import dto.response.RescueAssignmentResponse;
import model.RescueAssignment;

@Component
public class RescueAssignmentMapper {

    public RescueAssignmentResponse toResponse(RescueAssignment entity) {
        if (entity == null) return null;
        return new RescueAssignmentResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getTeamId(),
                entity.getAssignedAt()
        );
    }
}
