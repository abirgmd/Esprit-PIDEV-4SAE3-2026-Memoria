package com.med.cognitive.controller;

import com.med.cognitive.dto.AidantMetricsDto;
import com.med.cognitive.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping("/aidant/{accompagnantId}")
    public ResponseEntity<AidantMetricsDto> getMetricsForAidant(@PathVariable Long accompagnantId) {
        return ResponseEntity.ok(metricsService.getMetricsForAidant(accompagnantId));
    }

    @GetMapping("/patients/{patientId}/mmse-score")
    public ResponseEntity<Map<String, Object>> getLatestMMSEScoreForPatient(@PathVariable String patientId) {
        double score = metricsService.getLatestMMSEScoreForPatient(patientId);
        Map<String, Object> response = new HashMap<>();
        response.put("patientId", patientId);
        response.put("mmseScore", score);
        response.put("hasPassedTest", score > 0);
        response.put("message", score > 0 ? "Score MMSE disponible" : "Ce patient n'a pas passé le test MMSE");
        return ResponseEntity.ok(response);
    }
}
