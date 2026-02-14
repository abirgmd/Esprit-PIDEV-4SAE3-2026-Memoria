package MemorIA.service;

import MemorIA.entity.diagnostic.Rapport;
import MemorIA.repository.RapportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RapportService {

    private final RapportRepository rapportRepository;

    public RapportService(RapportRepository rapportRepository) {
        this.rapportRepository = rapportRepository;
    }

    public List<Rapport> getAllRapports() {
        return rapportRepository.findAll();
    }

    public Optional<Rapport> getRapportById(Long id) {
        return rapportRepository.findById(id);
    }

    public Rapport saveRapport(Rapport rapport) {
        return rapportRepository.save(rapport);
    }

    public Rapport updateRapport(Long id, Rapport rapportDetails) {
        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rapport not found with id: " + id));
        
        rapport.setTitre(rapportDetails.getTitre());
        rapport.setResumer(rapportDetails.getResumer());
        rapport.setAnalyseDetaillee(rapportDetails.getAnalyseDetaillee());
        rapport.setValideParMedecin(rapportDetails.getValideParMedecin());
        rapport.setDateGeneration(rapportDetails.getDateGeneration());
        
        return rapportRepository.save(rapport);
    }

    public void deleteRapport(Long id) {
        rapportRepository.deleteById(id);
    }

    public Optional<Rapport> getRapportByScoreId(Long idScore) {
        return rapportRepository.findByScoreIdScore(idScore);
    }

    public List<Rapport> getRapportsByValidationStatus(Boolean valideParMedecin) {
        return rapportRepository.findByValideParMedecin(valideParMedecin);
    }
}
