package service;

import model.Location;
import model.UserLocation;
import org.apache.catalina.User;
import repository.LocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.UserLocationRepository;

import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public void saveLocation(Location location) {
        locationRepository.save(location);
    }

    public Optional<UserLocation> getLatestLocation(String userId) {
        return locationRepository.findTopByUserIdOrderByUpdatedAtDesc(userId);
    }
}
