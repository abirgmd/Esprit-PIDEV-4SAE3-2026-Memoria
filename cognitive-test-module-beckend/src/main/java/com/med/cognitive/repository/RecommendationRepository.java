package com.med.cognitive.repository;

import com.med.cognitive.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByDecisionId(Long decisionId);

    List<Recommendation> findByTargetRole(Recommendation.TargetRole targetRole);

    List<Recommendation> findByStatus(Recommendation.RecommendStatus status);

    List<Recommendation> findByTargetRoleAndStatus(Recommendation.TargetRole role,
            Recommendation.RecommendStatus status);

    List<Recommendation> findByDeadlineBeforeAndStatusNot(LocalDateTime date, Recommendation.RecommendStatus status);
}
