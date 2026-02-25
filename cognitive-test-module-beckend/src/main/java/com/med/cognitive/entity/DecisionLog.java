package com.med.cognitive.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.med.cognitive.entity.Decision.DecisionSource;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "decision_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DecisionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "decision_id")
    private Long decisionId;

    @Column(name = "triggered_by")
    private String triggeredBy;

    private LocalDateTime timestamp;

    @Convert(converter = MapToStringConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> metadata;

    private String interpretation;

    @Column(name = "test_date")
    private LocalDateTime testDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type")
    private DecisionSource sourceType;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "confidence_threshold")
    private Double confidenceThreshold;
}
