package MemorIA.service;

import MemorIA.entity.Traitements.HistoriquePosition;
import MemorIA.repository.HistoriquePositionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistoriquePositionService {

    private final HistoriquePositionRepository historiquePositionRepository;

    public HistoriquePositionService(HistoriquePositionRepository historiquePositionRepository) {
        this.historiquePositionRepository = historiquePositionRepository;
    }

    public List<HistoriquePosition> getAllHistoriquePositions() {
        return historiquePositionRepository.findAll();
    }

    public Optional<HistoriquePosition> getHistoriquePositionById(Long id) {
        return historiquePositionRepository.findById(id);
    }

    public HistoriquePosition saveHistoriquePosition(HistoriquePosition historiquePosition) {
        return historiquePositionRepository.save(historiquePosition);
    }

    public HistoriquePosition updateHistoriquePosition(Long id, HistoriquePosition historiquePositionDetails) {
        HistoriquePosition historiquePosition = historiquePositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historique Position not found with id: " + id));

        historiquePosition.setLatitude(historiquePositionDetails.getLatitude());
        historiquePosition.setLongitude(historiquePositionDetails.getLongitude());
        historiquePosition.setDureeArretMinute(historiquePositionDetails.getDureeArretMinute());
        historiquePosition.setHeureArrive(historiquePositionDetails.getHeureArrive());
        historiquePosition.setHeureDepart(historiquePositionDetails.getHeureDepart());
        historiquePosition.setDistancePointPrecedent(historiquePositionDetails.getDistancePointPrecedent());
        historiquePosition.setDistancePointSuivant(historiquePositionDetails.getDistancePointSuivant());
        historiquePosition.setDateEnregistrement(historiquePositionDetails.getDateEnregistrement());
        historiquePosition.setLocalisation(historiquePositionDetails.getLocalisation());

        return historiquePositionRepository.save(historiquePosition);
    }

    public void deleteHistoriquePosition(Long id) {
        historiquePositionRepository.deleteById(id);
    }

    public List<HistoriquePosition> getHistoriquePositionsByLocalisation(Long idLocalisation) {
        return historiquePositionRepository.findByLocalisationIdLocalisation(idLocalisation);
    }

    public List<HistoriquePosition> getHistoriquePositionsByDateRange(LocalDateTime debut, LocalDateTime fin) {
        return historiquePositionRepository.findByDateEnregistrementBetween(debut, fin);
    }

    public List<HistoriquePosition> getHistoriquePositionsByLocalisationOrderedByDate(Long idLocalisation) {
        return historiquePositionRepository.findByLocalisationIdLocalisationOrderByDateEnregistrementDesc(idLocalisation);
    }
}
