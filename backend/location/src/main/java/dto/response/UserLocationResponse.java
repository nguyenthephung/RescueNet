package dto.response;

import java.time.Instant;

public class UserLocationResponse {
    private Long id;
    private String userId;
    private Double latitude;
    private Double longitude;
    private Instant updatedAt;

    public UserLocationResponse() {}

    public UserLocationResponse(Long id, String userId, Double latitude, Double longitude, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.updatedAt = updatedAt;
    }

    public UserLocationResponse(Long id, String userId, Double latitude, Double longitude) {
        this.id = id;
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
