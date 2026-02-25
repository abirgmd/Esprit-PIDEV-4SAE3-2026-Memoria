package com.med.cognitive.service;

import com.med.cognitive.dto.AssignationRequest;
import com.med.cognitive.dto.PersonalizedTestRequest;
import com.med.cognitive.entity.*;
import com.med.cognitive.exception.BusinessLogicException;
import com.med.cognitive.exception.ResourceNotFoundException;
import com.med.cognitive.repository.PatientTestAssignRepository;
import com.med.cognitive.repository.TestAnswerRepository;
import com.med.cognitive.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignationService {

    private final PatientTestAssignRepository assignRepository;
    private final TestResultRepository resultRepository;
    private final TestAnswerRepository answerRepository;
    private final CognitiveTestService testService;
    private final UserModuleService userService;

    public PatientTestAssign createAssignation(AssignationRequest request) {
        // Validate patient and soignant exist in module user
        if (!userService.userExists(request.getPatientId(), "PATIENT")) {
            throw new ResourceNotFoundException("Patient not found in user module: " +
                    request.getPatientId());
        }
        if (!userService.userExists(request.getSoignantId(), "SOIGNANT")) {
            throw new ResourceNotFoundException("Soignant not found in user module: " +
                    request.getSoignantId());
        }
        if (request.getAccompagnantId() != null
                && !userService.userExists(request.getAccompagnantId(), "ACCOMPAGNANT")) {
            throw new ResourceNotFoundException(
                    "Accompagnant not found in user module: " + request.getAccompagnantId());
        }

        CognitiveTest test = testService.getById(request.getTestId());

        PatientTestAssign assign = new PatientTestAssign();
        assign.setPatientId(request.getPatientId());
        assign.setTest(test);
        assign.setSoignantId(request.getSoignantId());
        assign.setAccompagnantId(request.getAccompagnantId());
        assign.setDateLimite(request.getDateLimite());
        assign.setInstructions(request.getInstructions());
        assign.setStatus(AssignStatus.ASSIGNED);

        return assignRepository.save(assign);
    }

    public List<PatientTestAssign> getAssignationsByMedecin(Long soignantId) {
        return assignRepository.findBySoignantId(soignantId);
    }

    public List<PatientTestAssign> getAssignationsByAidant(Long accompagnantId) {
        return assignRepository.findByAccompagnantIdAndStatus(accompagnantId, AssignStatus.ASSIGNED);
    }

    public List<PatientTestAssign> getPlanningByAidant(Long accompagnantId) {
        return assignRepository.findByAccompagnantId(accompagnantId);
    }

    public List<PatientTestAssign> getAssignationsByPatient(Long patientId) {
        return assignRepository.findByPatientId(patientId);
    }

    public TestResult startTest(Long assignId, Long accompagnantId) {
        PatientTestAssign assign = assignRepository.findById(assignId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignation not found: " + assignId));

        if (assign.getStatus() != AssignStatus.ASSIGNED) {
            throw new BusinessLogicException("Test cannot be started. Current status: " + assign.getStatus());
        }

        assign.setStatus(AssignStatus.IN_PROGRESS);
        assignRepository.save(assign);

        TestResult result = new TestResult();
        result.setAssignation(assign);
        result.setAccompagnantId(accompagnantId);
        result.setScoreMax(assign.getTest().getTotalScore());
        result.setDateDebut(LocalDateTime.now());

        return resultRepository.save(result);
    }

    public TestResult finishTest(Long resultId, List<TestAnswer> answers, String observations) {
        TestResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Test result not found: " + resultId));

        PatientTestAssign assign = result.getAssignation();

        // Save answers
        int scoreTotal = 0;
        for (TestAnswer answer : answers) {
            answer.setTestResult(result);
            scoreTotal += (answer.getPointsObtained() != null ? answer.getPointsObtained() : 0);
            answerRepository.save(answer);
        }

        result.setScoreTotal(scoreTotal);
        result.setObservations(observations);
        result.setDateFin(LocalDateTime.now());
        result.setAnswers(answers);

        assign.setStatus(AssignStatus.COMPLETED);
        assignRepository.save(assign);

        return resultRepository.save(result);
    }

    public PatientTestAssign createPersonalizedAssignation(PersonalizedTestRequest request) {
        try {
            // Validate patient exists
            if (!userService.userExists(request.getPatientId(), "PATIENT")) {
                throw new ResourceNotFoundException("Patient not found: " + request.getPatientId());
            }
            
            // Get patient to find his soignant
            Patient patient = userService.getPatientById(request.getPatientId());
            if (patient == null) {
                throw new ResourceNotFoundException("Patient not found: " + request.getPatientId());
            }
            
            // Auto-determine soignantId from patient's doctor
            Long soignantId = request.getSoignantId();
            if (soignantId == null && patient.getSoignant() != null) {
                soignantId = patient.getSoignant().getId();
            }
            
            // If still no soignant, try to find one or use default
            if (soignantId == null) {
                List<Soignant> soignants = userService.getAllSoignants();
                if (!soignants.isEmpty()) {
                    soignantId = soignants.get(0).getId(); // Use first available soignant
                } else {
                    throw new ResourceNotFoundException("No soignant available in the system");
                }
            }
            
            // Validate soignant exists
            if (!userService.userExists(soignantId, "SOIGNANT")) {
                throw new ResourceNotFoundException("Soignant not found: " + soignantId);
            }

            // Create Test with minimal required fields
            CognitiveTest test = new CognitiveTest();
            test.setTitre(request.getTitre() != null ? request.getTitre() : "Test Personnalisé");
            test.setDescription(request.getDescription());
            test.setType(CognitiveTest.TypeTest.MEMORY); // Use MEMORY instead of PERSONNALISE to avoid DB constraint
            test.setTotalScore(0);
            test.setIdUser(soignantId.toString());
            test.setIsActive(true);

            // Set difficulty based on stage
            if (request.getStage() != null) {
                switch (request.getStage()) {
                    case "STABLE":
                        test.setDifficultyLevel(CognitiveTest.DifficultyLevel.FACILE);
                        break;
                    case "MOYEN":
                        test.setDifficultyLevel(CognitiveTest.DifficultyLevel.MOYEN);
                        break;
                    case "CRITIQUE":
                        test.setDifficultyLevel(CognitiveTest.DifficultyLevel.AVANCE);
                        break;
                    default:
                        test.setDifficultyLevel(CognitiveTest.DifficultyLevel.MOYEN);
                }
            } else {
                test.setDifficultyLevel(CognitiveTest.DifficultyLevel.MOYEN);
            }

            // Create Questions (only if items provided)
            List<TestQuestion> questions = new ArrayList<>();
            if (request.getItems() != null && !request.getItems().isEmpty()) {
                int order = 1;
                for (PersonalizedTestRequest.Item item : request.getItems()) {
                    TestQuestion q = new TestQuestion();
                    q.setQuestionText(item.getQuestion());
                    q.setCorrectAnswer(item.getReponse());
                    q.setScore(item.getScore() != null ? item.getScore() : 0);
                    q.setOrderIndex(order++);
                    q.setImageUrl(item.getImageUrl());

                    if (item.getImageUrl() != null && !item.getImageUrl().isEmpty()) {
                        q.setQuestionType(TestQuestion.QuestionType.IMAGE);
                    } else {
                        q.setQuestionType(TestQuestion.QuestionType.TEXT);
                    }

                    // Store metadata in explanation as simplistic JSON-like string
                    if (item.getMetadata() != null && !item.getMetadata().isEmpty()) {
                        q.setExplanation(item.getMetadata().toString());
                    }

                    q.setTest(test);
                    questions.add(q);
                }
            }
            test.setQuestions(questions);

            // Save Test (Cascade saves questions)
            test = testService.create(test);

            // Create Assignation
            PatientTestAssign assign = new PatientTestAssign();
            assign.setPatientId(request.getPatientId());
            assign.setTest(test);
            assign.setSoignantId(soignantId);
            assign.setAccompagnantId(request.getAccompagnantId());
            assign.setDateLimite(request.getDateLimitAsLocalDate());
            assign.setInstructions(request.getInstructions());
            assign.setStatus(AssignStatus.ASSIGNED);
            assign.setDateAssignation(LocalDateTime.now());

            return assignRepository.save(assign);
        } catch (Exception e) {
            // Log the error and rethrow
            System.err.println("Error in createPersonalizedAssignation: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create personalized test: " + e.getMessage(), e);
        }
    }
}
