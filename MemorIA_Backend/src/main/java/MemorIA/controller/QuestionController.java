package MemorIA.controller;

import MemorIA.entity.diagnostic.Question;
import MemorIA.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionService.saveQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        try {
            Question updatedQuestion = questionService.updateQuestion(id, question);
            return ResponseEntity.ok(updatedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/diagnostic/{idDiagnostic}")
    public ResponseEntity<List<Question>> getQuestionsByDiagnosticId(@PathVariable Long idDiagnostic) {
        List<Question> questions = questionService.getQuestionsByDiagnosticId(idDiagnostic);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/diagnostic/{idDiagnostic}/ordered")
    public ResponseEntity<List<Question>> getQuestionsByDiagnosticIdOrdered(@PathVariable Long idDiagnostic) {
        List<Question> questions = questionService.getQuestionsByDiagnosticIdOrdered(idDiagnostic);
        return ResponseEntity.ok(questions);
    }
}
