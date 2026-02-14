package MemorIA.service;

import MemorIA.entity.diagnostic.Question;
import MemorIA.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        
        question.setQuestion(questionDetails.getQuestion());
        question.setPointMaximal(questionDetails.getPointMaximal());
        question.setTemplimite(questionDetails.getTemplimite());
        question.setOrderQuestion(questionDetails.getOrderQuestion());
        
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public List<Question> getQuestionsByDiagnosticId(Long idDiagnostic) {
        return questionRepository.findByDiagnosticIdDiagnostic(idDiagnostic);
    }

    public List<Question> getQuestionsByDiagnosticIdOrdered(Long idDiagnostic) {
        return questionRepository.findByDiagnosticIdDiagnosticOrderByOrderQuestionAsc(idDiagnostic);
    }
}
