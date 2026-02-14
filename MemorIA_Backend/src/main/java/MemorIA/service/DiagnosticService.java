package MemorIA.service;

import MemorIA.entity.diagnostic.Diagnostic;
import MemorIA.repository.DiagnosticRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiagnosticService {

    private final DiagnosticRepository diagnosticRepository;

    public DiagnosticService(DiagnosticRepository diagnosticRepository) {
        this.diagnosticRepository = diagnosticRepository;
    }

    public List<Diagnostic> getAllDiagnostics() {
        return diagnosticRepository.findAll();
    }

    public Optional<Diagnostic> getDiagnosticById(Long id) {
        return diagnosticRepository.findById(id);
    }

    public Diagnostic saveDiagnostic(Diagnostic diagnostic) {
        return diagnosticRepository.save(diagnostic);
    }

    public Diagnostic updateDiagnostic(Long id, Diagnostic diagnosticDetails) {
        Diagnostic diagnostic = diagnosticRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diagnostic not found with id: " + id));
        
        diagnostic.setTitre(diagnosticDetails.getTitre());
        diagnostic.setDateDebut(diagnosticDetails.getDateDebut());
        diagnostic.setDateFin(diagnosticDetails.getDateFin());
        diagnostic.setDureeMinutes(diagnosticDetails.getDureeMinutes());
        diagnostic.setDateDiagnostic(diagnosticDetails.getDateDiagnostic());
        diagnostic.setRiskLevel(diagnosticDetails.getRiskLevel());
        diagnostic.setPourcentageAlzeimer(diagnosticDetails.getPourcentageAlzeimer());
        diagnostic.setAiScore(diagnosticDetails.getAiScore());
        
        return diagnosticRepository.save(diagnostic);
    }

    public void deleteDiagnostic(Long id) {
        diagnosticRepository.deleteById(id);
    }

    public List<Diagnostic> getDiagnosticsByUserId(Long userId) {
        return diagnosticRepository.findByUserId(userId);
    }

    public List<Diagnostic> getDiagnosticsByRiskLevel(String riskLevel) {
        return diagnosticRepository.findByRiskLevel(riskLevel);
    }
}
