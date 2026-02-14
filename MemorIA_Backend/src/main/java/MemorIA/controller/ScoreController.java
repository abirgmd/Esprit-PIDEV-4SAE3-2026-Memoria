package MemorIA.controller;

import MemorIA.entity.diagnostic.Score;
import MemorIA.service.ScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "*")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @GetMapping
    public ResponseEntity<List<Score>> getAllScores() {
        List<Score> scores = scoreService.getAllScores();
        return ResponseEntity.ok(scores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Score> getScoreById(@PathVariable Long id) {
        return scoreService.getScoreById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Score> createScore(@RequestBody Score score) {
        Score savedScore = scoreService.saveScore(score);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedScore);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Score> updateScore(@PathVariable Long id, @RequestBody Score score) {
        try {
            Score updatedScore = scoreService.updateScore(id, score);
            return ResponseEntity.ok(updatedScore);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScore(@PathVariable Long id) {
        scoreService.deleteScore(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/diagnostic/{idDiagnostic}")
    public ResponseEntity<Score> getScoreByDiagnosticId(@PathVariable Long idDiagnostic) {
        return scoreService.getScoreByDiagnosticId(idDiagnostic)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
