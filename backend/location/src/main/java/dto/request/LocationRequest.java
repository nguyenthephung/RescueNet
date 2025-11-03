package dto.request;

import lombok.Data;

@Data
public class LocationRequest {
    private String userId;
    private double lat;
    private double lon;
}
