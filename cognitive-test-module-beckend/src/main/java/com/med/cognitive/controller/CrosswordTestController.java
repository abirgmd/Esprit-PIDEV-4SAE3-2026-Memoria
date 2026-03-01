package com.med.cognitive.controller;

import com.med.cognitive.dto.CrosswordAnswerDto;
import com.med.cognitive.dto.CrosswordResultDto;
import com.med.cognitive.entity.TestAnswer;
import com.med.cognitive.entity.TestQuestion;
import com.med.cognitive.entity.TestResult;
import com.med.cognitive.entity.CognitiveTest;
import com.med.cognitive.repository.TestAnswerRepository;
import com.med.cognitive.repository.TestQuestionRepository;
import com.med.cognitive.repository.TestResultRepository;
import com.med.cognitive.repository.CognitiveTestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/crossword")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class CrosswordTestController {

    private final TestAnswerRepository testAnswerRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final TestResultRepository testResultRepository;
    private final CognitiveTestRepository cognitiveTestRepository;

    @PostMapping("/save-answer")
    public ResponseEntity<String> saveAnswer(@RequestBody CrosswordAnswerDto answerDto) {
        try {
            log.info("Saving crossword answer: {}", answerDto);
            
            // Create new test answer
            TestAnswer testAnswer = new TestAnswer();
            
            // Set question
            TestQuestion question = testQuestionRepository.findById(answerDto.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answerDto.getQuestionId()));
            testAnswer.setQuestion(question);
            
            // Set answer text
            testAnswer.setAnswerText(answerDto.getAnswer());
            
            // Check if answer is correct (you can implement your logic here)
            boolean isCorrect = checkCrosswordAnswer(answerDto.getAnswer(), question.getCorrectAnswer());
            testAnswer.setIsCorrect(isCorrect);
            
            // Set points
            testAnswer.setPointsObtained(isCorrect ? question.getScore() : 0);
            
            // Save answer
            testAnswerRepository.save(testAnswer);
            
            log.info("Answer saved successfully");
            return ResponseEntity.ok("Answer saved successfully");
            
        } catch (Exception e) {
            log.error("Error saving answer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving answer: " + e.getMessage());
        }
    }

    @PostMapping("/submit-test")
    public ResponseEntity<CrosswordResultDto> submitCrosswordTest(@RequestBody CrosswordResultDto resultDto) {
        try {
            log.info("Submitting crossword test result: {}", resultDto);
            
            // Get test
            CognitiveTest test = cognitiveTestRepository.findById(resultDto.getTestId())
                    .orElseThrow(() -> new RuntimeException("Test not found: " + resultDto.getTestId()));
            
            // Create test result
            TestResult result = new TestResult();
            result.setPatientId(String.valueOf(resultDto.getPatientId()));
            result.setTest(test);
            result.setScoreTotale(resultDto.getScore());
            result.setTestDate(LocalDateTime.now());
            result.setDateFin(LocalDateTime.now());
            result.setIsValid(true);
            
            // Save result
            result = testResultRepository.save(result);
            
            // Update result DTO with saved result ID
            resultDto.setResultId(result.getId());
            
            log.info("Crossword test submitted successfully with score: {}", resultDto.getScore());
            return ResponseEntity.ok(resultDto);
            
        } catch (Exception e) {
            log.error("Error submitting crossword test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CrosswordResultDto.builder()
                            .error("Error submitting test: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/test-answers/{testId}")
    public ResponseEntity<List<TestAnswer>> getTestAnswers(@PathVariable Long testId) {
        try {
            List<TestAnswer> answers = testAnswerRepository.findByTestResultTestId(testId);
            return ResponseEntity.ok(answers);
        } catch (Exception e) {
            log.error("Error getting test answers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private boolean checkCrosswordAnswer(String userAnswer, String correctAnswer) {
        if (userAnswer == null || correctAnswer == null) {
            return false;
        }
        return userAnswer.trim().equalsIgnoreCase(correctAnswer.trim());
    }
}
