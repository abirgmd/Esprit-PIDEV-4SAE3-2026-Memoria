package MemorIA.repository;

import MemorIA.entity.Traitements.HistoriquePosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoriquePositionRepository extends JpaRepository<HistoriquePosition, Long> {
    List<HistoriquePosition> findByLocalisationIdLocalisation(Long idLocalisation);
    List<HistoriquePosition> findByDateEnregistrementBetween(LocalDateTime debut, LocalDateTime fin);
    List<HistoriquePosition> findByLocalisationIdLocalisationOrderByDateEnregistrementDesc(Long idLocalisation);
}
