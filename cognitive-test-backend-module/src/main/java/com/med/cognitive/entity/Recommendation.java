package com.med.cognitive.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decision_id")
    private Decision decision;

    @NotNull
    @Size(max = 1000)
    private String action;

    @Enumerated(EnumType.STRING)
    private PriorityLevel priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_role")
    private TargetRole targetRole;

    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    private RecommendStatus status;

    private String notes;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "completed_by")
    private String completedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Enums
    public enum PriorityLevel {
        FAIBLE, MOYENNE, ELEVEE, URGENTE
    }

    public enum TargetRole {
        MEDECIN, AIDANT, PATIENT
    }

    public enum RecommendStatus {
        PENDING, IN_PROGRESS, COMPLETED, DISMISSED
    }
}
