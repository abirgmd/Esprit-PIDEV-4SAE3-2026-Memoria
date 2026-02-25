package com.med.cognitive.controller;

import com.med.cognitive.entity.Recommendation;
import com.med.cognitive.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService service;

    @GetMapping("/my-tasks")
    public ResponseEntity<List<Recommendation>> getMyTasks(@RequestParam("role") Recommendation.TargetRole role) {
        return ResponseEntity.ok(service.getByRole(role));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Recommendation> complete(
            @PathVariable("id") Long id,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam("userId") String userId) {
        return ResponseEntity.ok(service.markAsCompleted(id, notes, userId));
    }
}
