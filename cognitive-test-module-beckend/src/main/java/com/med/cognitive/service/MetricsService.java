package com.med.cognitive.service;

import com.med.cognitive.dto.*;
import com.med.cognitive.entity.*;
import com.med.cognitive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final PatientTestAssignRepository assignRepository;
    private final TestResultRepository testResultRepository;
    private final CognitiveTestRepository cognitiveTestRepository;

    public AidantMetricsDto getMetricsForAidant(Long accompagnantId) {
        // All assignations for this aidant
        List<PatientTestAssign> assignations = assignRepository.findByAccompagnantId(accompagnantId);
        // All test results for this aidant (via patient)
        List<TestResult> results = testResultRepository.findAll().stream()
                .filter(r -> assignations.stream().anyMatch(a -> a.getPatientId().equals(r.getPatientId())))
                .collect(Collectors.toList());

        long totalAssigned = assignations.size();
        long totalCompleted = assignations.stream().mapToLong(a -> a.getStatus() == AssignStatus.COMPLETED ? 1 : 0).sum();

        // Success rate: if there is a TestResult with a score >= 50% of maxScore (or any positive score)
        long successful = results.stream().filter(r -> r.getScoreTotale() != null && r.getScoreTotale() > 0).count();
        double successRate = totalCompleted > 0 ? (double) successful / totalCompleted * 100 : 0.0;

        // Average score per test type (using CognitiveTest.type)
        Map<String, Double> avgScoreByType = new HashMap<>();
        for (TestResult r : results) {
            if (r.getScoreTotale() == null) continue;
            CognitiveTest test = cognitiveTestRepository.findById(Long.valueOf(r.getPatientId())).orElse(null);
            if (test == null || test.getType() == null) continue;
            String type = test.getType().name();
            avgScoreByType.merge(type, (double) r.getScoreTotale(), (old, val) -> (old + val) / 2);
        }

        // Evolution temporelle : nombre de tests complétés par mois sur 6 derniers mois
        Map<String, Long> monthlyCounts = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate month = today.minusMonths(i);
            String key = month.getYear() + "-" + String.format("%02d", month.getMonthValue());
            long count = assignations.stream()
                    .filter(a -> a.getStatus() == AssignStatus.COMPLETED &&
                            a.getDateAssignation() != null &&
                            a.getDateAssignation().toLocalDate().getYear() == month.getYear() &&
                            a.getDateAssignation().toLocalDate().getMonthValue() == month.getMonthValue())
                    .count();
            monthlyCounts.put(key, count);
        }

        return new AidantMetricsDto(
                totalAssigned,
                totalCompleted,
                successRate,
                avgScoreByType,
                monthlyCounts
        );
    }

    /**
     * Récupère le dernier score MMSE d’un patient (ou 0 si aucun test passé)
     */
    public double getLatestMMSEScoreForPatient(String patientId) {
        List<TestResult> results = testResultRepository.findAll().stream()
                .filter(r -> patientId.equals(r.getPatientId()))
                .filter(r -> r.getScoreTotale() != null)
                .sorted((a, b) -> b.getTestDate().compareTo(a.getTestDate()))
                .collect(Collectors.toList());
        if (results.isEmpty()) {
            return 0.0;
        }
        return results.get(0).getScoreTotale().doubleValue();
    }
}
