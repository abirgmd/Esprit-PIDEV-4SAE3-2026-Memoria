package com.med.cognitive.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "decisions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Decision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "patient_id")
    private String patientId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_result_id")
    private TestResult testResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "decision_type")
    private DecisionType decisionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel;

    private Double confidence;

    @Column(length = 2000)
    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type")
    private DecisionSource sourceType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private String createdBy;

    private Boolean approved = false;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Recommendation> recommendations = new ArrayList<>();

    // Enums
    public enum DecisionType {
        SURVEILLANCE, ALERTE, CONSULTATION, URGENCE
    }

    public enum RiskLevel {
        FAIBLE, MOYEN, ELEVE, CRITIQUE
    }

    public enum DecisionSource {
        MANUAL, AI_MODEL, RULE_BASED, HYBRID
    }
}
