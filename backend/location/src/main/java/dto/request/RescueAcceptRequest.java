package dto.request;

import lombok.Data;

@Data
public class RescueAcceptRequest {
    private String rescueTeamId;
    private String userId;
}
