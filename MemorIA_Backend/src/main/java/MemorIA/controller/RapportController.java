package MemorIA.controller;

import MemorIA.entity.diagnostic.Rapport;
import MemorIA.service.RapportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@CrossOrigin(origins = "*")
public class RapportController {

    private final RapportService rapportService;

    public RapportController(RapportService rapportService) {
        this.rapportService = rapportService;
    }

    @GetMapping
    public ResponseEntity<List<Rapport>> getAllRapports() {
        List<Rapport> rapports = rapportService.getAllRapports();
        return ResponseEntity.ok(rapports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rapport> getRapportById(@PathVariable Long id) {
        return rapportService.getRapportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Rapport> createRapport(@RequestBody Rapport rapport) {
        Rapport savedRapport = rapportService.saveRapport(rapport);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRapport);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rapport> updateRapport(@PathVariable Long id, @RequestBody Rapport rapport) {
        try {
            Rapport updatedRapport = rapportService.updateRapport(id, rapport);
            return ResponseEntity.ok(updatedRapport);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRapport(@PathVariable Long id) {
        rapportService.deleteRapport(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/score/{idScore}")
    public ResponseEntity<Rapport> getRapportByScoreId(@PathVariable Long idScore) {
        return rapportService.getRapportByScoreId(idScore)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/validation/{valideParMedecin}")
    public ResponseEntity<List<Rapport>> getRapportsByValidationStatus(@PathVariable Boolean valideParMedecin) {
        List<Rapport> rapports = rapportService.getRapportsByValidationStatus(valideParMedecin);
        return ResponseEntity.ok(rapports);
    }
}
