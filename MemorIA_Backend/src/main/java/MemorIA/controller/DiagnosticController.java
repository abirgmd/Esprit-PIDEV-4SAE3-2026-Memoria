package MemorIA.controller;

import MemorIA.entity.diagnostic.Diagnostic;
import MemorIA.service.DiagnosticService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diagnostics")
@CrossOrigin(origins = "*")
public class DiagnosticController {

    private final DiagnosticService diagnosticService;

    public DiagnosticController(DiagnosticService diagnosticService) {
        this.diagnosticService = diagnosticService;
    }

    @GetMapping
    public ResponseEntity<List<Diagnostic>> getAllDiagnostics() {
        List<Diagnostic> diagnostics = diagnosticService.getAllDiagnostics();
        return ResponseEntity.ok(diagnostics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diagnostic> getDiagnosticById(@PathVariable Long id) {
        return diagnosticService.getDiagnosticById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Diagnostic> createDiagnostic(@RequestBody Diagnostic diagnostic) {
        Diagnostic savedDiagnostic = diagnosticService.saveDiagnostic(diagnostic);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDiagnostic);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Diagnostic> updateDiagnostic(@PathVariable Long id, @RequestBody Diagnostic diagnostic) {
        try {
            Diagnostic updatedDiagnostic = diagnosticService.updateDiagnostic(id, diagnostic);
            return ResponseEntity.ok(updatedDiagnostic);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiagnostic(@PathVariable Long id) {
        diagnosticService.deleteDiagnostic(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Diagnostic>> getDiagnosticsByUserId(@PathVariable Long userId) {
        List<Diagnostic> diagnostics = diagnosticService.getDiagnosticsByUserId(userId);
        return ResponseEntity.ok(diagnostics);
    }

    @GetMapping("/risk-level/{riskLevel}")
    public ResponseEntity<List<Diagnostic>> getDiagnosticsByRiskLevel(@PathVariable String riskLevel) {
        List<Diagnostic> diagnostics = diagnosticService.getDiagnosticsByRiskLevel(riskLevel);
        return ResponseEntity.ok(diagnostics);
    }
}
