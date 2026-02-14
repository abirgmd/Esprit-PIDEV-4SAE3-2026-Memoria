package MemorIA.repository;

import MemorIA.entity.diagnostic.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findByDiagnosticIdDiagnostic(Long idDiagnostic);
}
