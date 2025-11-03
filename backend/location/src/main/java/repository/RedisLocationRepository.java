package repository;

import model.UserLocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RedisLocationRepository {

    @Autowired
    private RedisTemplate<String, UserLocation> redisTemplate;

    public void save(UserLocation location) {
        redisTemplate.opsForValue().set("location:" + location.getUserId(), location);
    }

    public UserLocation findByUserId(String userId) {
        return redisTemplate.opsForValue().get("location:" + userId);
    }
}
