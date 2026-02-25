package com.med.cognitive.service;

import com.med.cognitive.entity.Recommendation;
import com.med.cognitive.repository.RecommendationRepository;
import com.med.cognitive.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RecommendationService {

    private final RecommendationRepository repository;

    public Recommendation getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found with id: " + id));
    }

    public List<Recommendation> getByRole(Recommendation.TargetRole role) {
        return repository.findByTargetRole(role);
    }

    public Recommendation markAsCompleted(Long id, String notes, String userId) {
        Recommendation rec = getById(id);
        rec.setStatus(Recommendation.RecommendStatus.COMPLETED);
        rec.setCompletedAt(LocalDateTime.now());
        rec.setCompletedBy(userId);
        if (notes != null) {
            rec.setNotes(notes);
        }
        return repository.save(rec);
    }

    public Recommendation reassign(Long id, Recommendation.TargetRole newRole) {
        Recommendation rec = getById(id);
        rec.setTargetRole(newRole);
        return repository.save(rec);
    }
}
