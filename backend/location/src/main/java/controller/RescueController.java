package controller;

import dto.request.RescueAcceptRequest;
import model.UserLocation;
import service.LocationService;
import service.RescueTeamService;
import repository.RedisLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rescue")
@RequiredArgsConstructor
public class RescueController {

    private final RescueTeamService rescueTeamService;
    private final RedisLocationRepository locationRepo;
    private final LocationService locationService;

    @PostMapping("/accept")
    public ResponseEntity<?> acceptRescue(@RequestBody RescueAcceptRequest req) {
        if (req.getRescueTeamId() == null || req.getUserId() == null) {
            return ResponseEntity.badRequest().body("rescueTeamId and userId are required");
        }

        // create assignment
        rescueTeamService.assignRescue(req.getRescueTeamId(), req.getUserId());

        // if we have a cached last location, push it immediately to the team so they see current pos
        UserLocation last = locationRepo.findByUserId(req.getUserId());
        if (last != null) {
            rescueTeamService.sendToTeam(req.getRescueTeamId(), last);
        }

        return ResponseEntity.ok().body("assigned");
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelAssignment(@RequestBody RescueAcceptRequest req) {
        rescueTeamService.unassign(req.getUserId());
        return ResponseEntity.ok().body("unassigned");
    }
}
