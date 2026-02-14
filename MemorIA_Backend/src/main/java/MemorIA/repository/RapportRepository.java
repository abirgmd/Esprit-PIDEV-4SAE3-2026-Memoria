package MemorIA.repository;

import MemorIA.entity.diagnostic.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {
    Optional<Rapport> findByScoreIdScore(Long idScore);
    List<Rapport> findByValideParMedecin(Boolean valideParMedecin);
}
