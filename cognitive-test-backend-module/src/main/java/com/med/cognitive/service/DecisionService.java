package com.med.cognitive.service;

import com.med.cognitive.entity.Decision;
import com.med.cognitive.entity.TestResult;
import com.med.cognitive.entity.Recommendation;
import com.med.cognitive.repository.DecisionRepository;
import com.med.cognitive.repository.TestResultRepository;
import com.med.cognitive.exception.ResourceNotFoundException;
import com.med.cognitive.validator.DecisionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DecisionService {

    private final DecisionRepository repository;
    private final TestResultRepository testResultRepository;
    private final DecisionValidator validator;

    public List<Decision> getByPatientId(String patientId) {
        return repository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public Decision getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Decision not found with id: " + id));
    }

    public Decision createAutoDecision(Long testResultId) {
        TestResult result = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new ResourceNotFoundException("TestResult not found with id: " + testResultId));

        Decision decision = new Decision();
        decision.setPatientId(result.getPatientId());
        decision.setTestResult(result);
        decision.setSourceType(Decision.DecisionSource.RULE_BASED);

        // Simple rule-based logic
        if (result.getSeverityLevel() != null) {
            switch (result.getSeverityLevel()) {
                case NORMAL:
                    decision.setDecisionType(Decision.DecisionType.SURVEILLANCE);
                    decision.setRiskLevel(Decision.RiskLevel.FAIBLE);
                    decision.setExplanation("Résultats normaux. Poursuite de la surveillance standard.");
                    decision.setConfidence(0.95);
                    break;
                case MILD:
                    decision.setDecisionType(Decision.DecisionType.SURVEILLANCE);
                    decision.setRiskLevel(Decision.RiskLevel.MOYEN);
                    decision.setExplanation("Léger déclin. Surveillance rapprochée recommandée.");
                    decision.setConfidence(0.85);
                    break;
                case MODERATE:
                    decision.setDecisionType(Decision.DecisionType.CONSULTATION);
                    decision.setRiskLevel(Decision.RiskLevel.ELEVE);
                    decision.setExplanation("Signes modérés. Consultation spécialiste requise.");
                    decision.setConfidence(0.80);
                    break;
                case SEVERE:
                    decision.setDecisionType(Decision.DecisionType.URGENCE);
                    decision.setRiskLevel(Decision.RiskLevel.CRITIQUE);
                    decision.setExplanation("Situation critique. Intervention immédiate nécessaire.");
                    decision.setConfidence(0.90);
                    break;
            }
        }

        validator.validate(decision);

        return repository.save(decision);
    }

    public Decision approveDecision(Long id, String approverId) {
        Decision decision = getById(id);
        decision.setApproved(true);
        decision.setApprovedBy(approverId);
        decision.setApprovedAt(LocalDateTime.now());

        // Auto-generate recommendations upon approval
        generateRecommendations(id);

        return repository.save(decision);
    }

    public void generateRecommendations(Long decisionId) {
        Decision decision = getById(decisionId);

        // Example simple logic
        if (decision.getRiskLevel() == Decision.RiskLevel.ELEVE
                || decision.getRiskLevel() == Decision.RiskLevel.CRITIQUE) {
            Recommendation rec = new Recommendation();
            rec.setDecision(decision);
            rec.setAction("Prendre rendez-vous avec un neurologue");
            rec.setPriority(Recommendation.PriorityLevel.ELEVEE);
            rec.setTargetRole(Recommendation.TargetRole.MEDECIN);
            rec.setDeadline(LocalDateTime.now().plusWeeks(1));
            decision.getRecommendations().add(rec);
        }

        repository.save(decision);
    }
}
