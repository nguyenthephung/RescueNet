package repository;

import exception.AppException;
import exception.ErrorCode;
import model.RescueAssignment;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RedisAssignmentRepository {
    private static final String ASSIGN_KEY_PREFIX = "assignment:"; // assignment:{userId} -> json RescueAssignment

    @Autowired
    private RedisTemplate<String, String> redisTemplate; // string-based template

    private final ObjectMapper mapper = new ObjectMapper();

    public void save(RescueAssignment assignment) {
        try {
            String json = mapper.writeValueAsString(assignment);
            redisTemplate.opsForValue().set(ASSIGN_KEY_PREFIX + assignment.getUserId(), json);
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public RescueAssignment findByUserId(String userId) {
        try {
            String json = redisTemplate.opsForValue().get(ASSIGN_KEY_PREFIX + userId);
            if (json == null) return null;
            return mapper.readValue(json, RescueAssignment.class);
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public void deleteByUserId(String userId) {
        redisTemplate.delete(ASSIGN_KEY_PREFIX + userId);
    }
}
