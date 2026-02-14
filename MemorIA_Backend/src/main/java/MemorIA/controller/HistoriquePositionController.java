package MemorIA.controller;

import MemorIA.entity.Traitements.HistoriquePosition;
import MemorIA.service.HistoriquePositionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/historique-positions")
@CrossOrigin(origins = "*")
public class HistoriquePositionController {

    private final HistoriquePositionService historiquePositionService;

    public HistoriquePositionController(HistoriquePositionService historiquePositionService) {
        this.historiquePositionService = historiquePositionService;
    }

    @GetMapping
    public ResponseEntity<List<HistoriquePosition>> getAllHistoriquePositions() {
        List<HistoriquePosition> historiquePositions = historiquePositionService.getAllHistoriquePositions();
        return ResponseEntity.ok(historiquePositions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoriquePosition> getHistoriquePositionById(@PathVariable Long id) {
        return historiquePositionService.getHistoriquePositionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HistoriquePosition> createHistoriquePosition(@RequestBody HistoriquePosition historiquePosition) {
        HistoriquePosition savedHistoriquePosition = historiquePositionService.saveHistoriquePosition(historiquePosition);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHistoriquePosition);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoriquePosition> updateHistoriquePosition(@PathVariable Long id, @RequestBody HistoriquePosition historiquePosition) {
        try {
            HistoriquePosition updatedHistoriquePosition = historiquePositionService.updateHistoriquePosition(id, historiquePosition);
            return ResponseEntity.ok(updatedHistoriquePosition);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistoriquePosition(@PathVariable Long id) {
        historiquePositionService.deleteHistoriquePosition(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/localisation/{idLocalisation}")
    public ResponseEntity<List<HistoriquePosition>> getHistoriquePositionsByLocalisation(@PathVariable Long idLocalisation) {
        List<HistoriquePosition> historiquePositions = historiquePositionService.getHistoriquePositionsByLocalisation(idLocalisation);
        return ResponseEntity.ok(historiquePositions);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<HistoriquePosition>> getHistoriquePositionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<HistoriquePosition> historiquePositions = historiquePositionService.getHistoriquePositionsByDateRange(debut, fin);
        return ResponseEntity.ok(historiquePositions);
    }

    @GetMapping("/localisation/{idLocalisation}/ordered")
    public ResponseEntity<List<HistoriquePosition>> getHistoriquePositionsByLocalisationOrderedByDate(@PathVariable Long idLocalisation) {
        List<HistoriquePosition> historiquePositions = historiquePositionService.getHistoriquePositionsByLocalisationOrderedByDate(idLocalisation);
        return ResponseEntity.ok(historiquePositions);
    }
}
