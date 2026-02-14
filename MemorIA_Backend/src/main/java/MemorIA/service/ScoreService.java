package MemorIA.service;

import MemorIA.entity.diagnostic.Score;
import MemorIA.repository.ScoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    public List<Score> getAllScores() {
        return scoreRepository.findAll();
    }

    public Optional<Score> getScoreById(Long id) {
        return scoreRepository.findById(id);
    }

    public Score saveScore(Score score) {
        return scoreRepository.save(score);
    }

    public Score updateScore(Long id, Score scoreDetails) {
        Score score = scoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Score not found with id: " + id));
        
        score.setScoreTotal(scoreDetails.getScoreTotal());
        score.setPourcentage(scoreDetails.getPourcentage());
        score.setDatecalcul(scoreDetails.getDatecalcul());
        
        return scoreRepository.save(score);
    }

    public void deleteScore(Long id) {
        scoreRepository.deleteById(id);
    }

    public Optional<Score> getScoreByDiagnosticId(Long idDiagnostic) {
        return scoreRepository.findByDiagnosticIdDiagnostic(idDiagnostic);
    }
}
