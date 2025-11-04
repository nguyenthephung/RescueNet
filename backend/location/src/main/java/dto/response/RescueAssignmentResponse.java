package dto.response;

import java.time.Instant;

public class RescueAssignmentResponse {
    private Long id;
    private Long userId;
    private Long teamId;
    private Instant assignedAt;

    public RescueAssignmentResponse() {}

    public RescueAssignmentResponse(Long id, Long userId, Long teamId, Instant assignedAt) {
        this.id = id;
        this.userId = userId;
        this.teamId = teamId;
        this.assignedAt = assignedAt;
    }

    public RescueAssignmentResponse(Long id, String userId, Object teamId, Instant assignedAt) {
        this.id = id;
        this.userId = Long.parseLong(userId);
        this.teamId = Long.parseLong((String) teamId);
        this.assignedAt = assignedAt;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }
}
