package model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "rescue_assignments")
@Data
public class RescueAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String rescueTeamId;
    private String status = "PENDING";
    private Instant assignedAt = Instant.now();

    public RescueAssignment(String userId, String teamId, Instant assignedAt) {
        this.userId = userId;
        this.rescueTeamId = teamId;
        this.assignedAt = assignedAt;
    }
}
