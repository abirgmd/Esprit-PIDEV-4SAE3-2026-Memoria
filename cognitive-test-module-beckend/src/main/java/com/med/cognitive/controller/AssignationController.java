package com.med.cognitive.controller;

import com.med.cognitive.dto.*;
import com.med.cognitive.entity.Accompagnant;
import com.med.cognitive.entity.AssignStatus;
import com.med.cognitive.entity.Patient;
import com.med.cognitive.entity.PatientTestAssign;
import com.med.cognitive.entity.Soignant;
import com.med.cognitive.entity.TestAnswer;
import com.med.cognitive.entity.TestResult;
import com.med.cognitive.repository.PatientRepository;
import com.med.cognitive.repository.PatientTestAssignRepository;
import com.med.cognitive.repository.SoignantRepository;
import com.med.cognitive.service.AssignationService;
import com.med.cognitive.service.CognitiveTestService;
import com.med.cognitive.service.UserModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AssignationController {

    private final AssignationService assignationService;
    private final UserModuleService userService;
    private final PatientRepository patientRepository;
    private final SoignantRepository soignantRepository;
    private final PatientTestAssignRepository assignRepository;
    private final CognitiveTestService testService;

    @GetMapping
    public ResponseEntity<List<PatientTestAssign>> getAll() {
        return ResponseEntity.ok(assignRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<PatientTestAssign> create(@RequestBody AssignationRequest request) {
        return ResponseEntity.ok(assignationService.createAssignation(request));
    }

    @PostMapping("/personalized")
    public ResponseEntity<PatientTestAssign> createPersonalized(@RequestBody PersonalizedTestRequest request) {
        return ResponseEntity.ok(assignationService.createPersonalizedAssignation(request));
    }

    @GetMapping("/medecin/{soignantId}")
    public ResponseEntity<List<PatientTestAssign>> getByMedecin(@PathVariable Long soignantId) {
        return ResponseEntity.ok(assignationService.getAssignationsByMedecin(soignantId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PatientTestAssign>> getAllAssignations() {
        return ResponseEntity.ok(assignRepository.findAll());
    }

    @GetMapping("/medecin/{soignantId}/patients")
    public ResponseEntity<List<Patient>> getPatientsByMedecin(@PathVariable Long soignantId) {
        return ResponseEntity.ok(userService.getPatientsBySoignant(soignantId));
    }

    @GetMapping("/medecin/patients/{patientId}/aidants")
    public ResponseEntity<List<Accompagnant>> getAidantsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(userService.getAccompagnantsByPatient(patientId));
    }

    @GetMapping("/aidants")
    public ResponseEntity<List<Accompagnant>> getAllAidants() {
        return ResponseEntity.ok(userService.getAllAccompagnants());
    }

    @GetMapping("/debug/soignants")
    public ResponseEntity<List<String>> getAllSoignants() {
        return ResponseEntity.ok(userService.getAllSoignants().stream()
                .map(s -> "ID: " + s.getId() + ", Name: " + s.getNom())
                .collect(Collectors.toList()));
    }

    @GetMapping("/patients/all")
    public ResponseEntity<List<Map<String, Object>>> getAllPatients() {
        return ResponseEntity.ok(userService.getAllSoignants().stream()
                .flatMap(s -> userService.getPatientsBySoignant(s.getId()).stream())
                .map(p -> Map.of(
                    "id", (Object) p.getId(),
                    "nom", (Object) p.getNom(),
                    "prenom", (Object) p.getPrenom(),
                    "email", (Object) (p.getEmail() != null ? p.getEmail() : "")
                ))
                .distinct()
                .collect(Collectors.toList()));
    }

    @GetMapping("/soignants/all")
    public ResponseEntity<List<Map<String, Object>>> getAllSoignantsList() {
        return ResponseEntity.ok(userService.getAllSoignants().stream()
                .map(s -> Map.of(
                    "id", (Object) s.getId(),
                    "nom", (Object) s.getNom(),
                    "prenom", (Object) s.getPrenom(),
                    "email", (Object) (s.getEmail() != null ? s.getEmail() : "")
                ))
                .collect(Collectors.toList()));
    }

    @GetMapping("/patients/search")
public ResponseEntity<List<Map<String, Object>>> searchPatients(@RequestParam(required = false) String query) {
    try {
        List<Patient> patients;
        
        if (query == null || query.trim().isEmpty()) {
            patients = patientRepository.findAll();
        } else {
            // Rechercher par nom ou prénom (case-insensitive)
            String searchQuery = query.trim().toLowerCase();
            patients = patientRepository.findAll().stream()
                    .filter(p -> (p.getNom() != null && p.getNom().toLowerCase().contains(searchQuery)) ||
                               (p.getPrenom() != null && p.getPrenom().toLowerCase().contains(searchQuery)))
                    .collect(Collectors.toList());
        }
        
        List<Map<String, Object>> patientsWithMedecin = patients.stream()
                .map(patient -> {
                    Map<String, Object> patientData = new java.util.HashMap<>();
                    patientData.put("id", patient.getId());
                    patientData.put("nom", patient.getNom());
                    patientData.put("prenom", patient.getPrenom());
                    patientData.put("email", patient.getEmail());
                    patientData.put("dateNaissance", patient.getDateNaissance());
                    patientData.put("sexe", patient.getSexe());
                    patientData.put("adresse", patient.getAdresse());
                    
                    // Ajouter le médecin associé
                    if (patient.getSoignant() != null) {
                        Map<String, Object> medecinData = new java.util.HashMap<>();
                        medecinData.put("id", patient.getSoignant().getId());
                        medecinData.put("nom", patient.getSoignant().getNom());
                        medecinData.put("prenom", patient.getSoignant().getPrenom());
                        medecinData.put("email", patient.getSoignant().getEmail());
                        medecinData.put("specialite", patient.getSoignant().getSpecialite());
                        patientData.put("medecin", medecinData);
                    } else {
                        patientData.put("medecin", null);
                    }
                    
                    return patientData;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(patientsWithMedecin);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(List.of(Map.of("error", e.getMessage())));
    }
}

@GetMapping("/patients/with-medecin")
public ResponseEntity<List<Map<String, Object>>> getAllPatientsWithMedecin() {
    try {
        List<Patient> patients = patientRepository.findAll();
        
        List<Map<String, Object>> patientsWithMedecin = patients.stream()
                .map(patient -> {
                    Map<String, Object> patientData = new java.util.HashMap<>();
                    patientData.put("id", patient.getId());
                    patientData.put("nom", patient.getNom());
                    patientData.put("prenom", patient.getPrenom());
                    patientData.put("email", patient.getEmail());
                    patientData.put("dateNaissance", patient.getDateNaissance());
                    patientData.put("sexe", patient.getSexe());
                    patientData.put("adresse", patient.getAdresse());
                    
                    // Ajouter le médecin associé
                    if (patient.getSoignant() != null) {
                        Map<String, Object> medecinData = new java.util.HashMap<>();
                        medecinData.put("id", patient.getSoignant().getId());
                        medecinData.put("nom", patient.getSoignant().getNom());
                        medecinData.put("prenom", patient.getSoignant().getPrenom());
                        medecinData.put("email", patient.getSoignant().getEmail());
                        medecinData.put("specialite", patient.getSoignant().getSpecialite());
                        patientData.put("medecin", medecinData);
                    } else {
                        patientData.put("medecin", null);
                    }
                    
                    return patientData;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(patientsWithMedecin);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(List.of(Map.of("error", e.getMessage())));
    }
}

@GetMapping("/dashboard/medecin/{soignantId}")
public ResponseEntity<Map<String, Object>> getMedecinDashboard(@PathVariable Long soignantId) {
    try {
        Soignant medecin = userService.getSoignantById(soignantId);
        if (medecin == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<Patient> patients = userService.getPatientsBySoignant(soignantId);
        List<PatientTestAssign> assignations = assignationService.getAssignationsByMedecin(soignantId);
        
        long totalTests = assignations.size();
        long completedTests = assignations.stream()
                .filter(a -> a.getStatus() == AssignStatus.COMPLETED)
                .count();
        long inProgressTests = assignations.stream()
                .filter(a -> a.getStatus() == AssignStatus.IN_PROGRESS)
                .count();
        
        return ResponseEntity.ok(Map.of(
            "medecin", Map.of(
                "id", medecin.getId(),
                "nom", medecin.getNom(),
                "prenom", medecin.getPrenom(),
                "email", medecin.getEmail(),
                "specialite", medecin.getSpecialite()
            ),
            "statistics", Map.of(
                "totalPatients", patients.size(),
                "totalTests", totalTests,
                "completedTests", completedTests,
                "inProgressTests", inProgressTests
            ),
            "recentPatients", patients.stream()
                    .limit(5)
                    .map(p -> Map.of(
                        "id", p.getId(),
                        "nom", p.getNom(),
                        "prenom", p.getPrenom(),
                        "email", p.getEmail()
                    ))
                    .collect(Collectors.toList())
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

@GetMapping("/dashboard/patient/{patientId}")
public ResponseEntity<Map<String, Object>> getPatientDashboard(@PathVariable Long patientId) {
    try {
        Patient patient = userService.getPatientById(patientId);
        if (patient == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<PatientTestAssign> assignations = assignationService.getAssignationsByPatient(patientId);
        Soignant soignant = patient.getSoignant();
        
        long totalTests = assignations.size();
        long completedTests = assignations.stream()
                .filter(a -> a.getStatus() == AssignStatus.COMPLETED)
                .count();
        
        return ResponseEntity.ok(Map.of(
            "patient", Map.of(
                "id", patient.getId(),
                "nom", patient.getNom(),
                "prenom", patient.getPrenom(),
                "email", patient.getEmail(),
                "dateNaissance", patient.getDateNaissance(),
                "sexe", patient.getSexe()
            ),
            "soignant", soignant != null ? Map.of(
                "id", soignant.getId(),
                "nom", soignant.getNom(),
                "prenom", soignant.getPrenom(),
                "specialite", soignant.getSpecialite()
            ) : null,
            "statistics", Map.of(
                "totalTests", totalTests,
                "completedTests", completedTests
            ),
            "recentTests", assignations.stream()
                    .limit(5)
                    .map(a -> Map.of(
                        "id", a.getId(),
                        "testName", a.getTest().getTitre(),
                        "status", a.getStatus().toString(),
                        "dateAssignation", a.getDateAssignation()
                    ))
                    .collect(Collectors.toList())
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

@PostMapping("/admin/cleanup-database")
public ResponseEntity<Map<String, Object>> cleanupDatabase() {
    try {
        // Supprimer toutes les assignations de tests
        List<PatientTestAssign> allAssignations = assignationService.getAssignationsByMedecin(null);
        // Récupérer toutes les assignations directement depuis le repository
        patientRepository.findAll().forEach(patient -> {
            List<PatientTestAssign> patientAssignations = assignationService.getAssignationsByPatient(patient.getId());
            patientAssignations.forEach(assignation -> {
                try {
                    // Supprimer les résultats de test associés
                    assignation.getTest().getQuestions().clear();
                    assignRepository.delete(assignation);
                } catch (Exception e) {
                    // Ignorer les erreurs de suppression
                }
            });
        });
        
        // Supprimer tous les tests personnalisés créés
        testService.getAll().stream()
            .filter(test -> test.getTitre().contains("Test Simple") || test.getTitre().contains("Test Personnalisé"))
            .forEach(test -> {
                try {
                    testService.delete(test.getId());
                } catch (Exception e) {
                    // Ignorer les erreurs de suppression
                }
            });
        
        return ResponseEntity.ok(Map.of(
            "message", "Base de données nettoyée - toutes les traces de test supprimées",
            "timestamp", java.time.LocalDateTime.now()
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Erreur lors du nettoyage: " + e.getMessage()
        ));
    }
}

@PostMapping("/admin/setup-single-doctor")
public ResponseEntity<Map<String, Object>> setupSingleDoctor() {
    try {
        // Créer un seul médecin sans forcer l'ID
        Soignant medecin = new Soignant("Médecine Générale", "75001");
        medecin.setNom("Martin");
        medecin.setPrenom("Dr. Sophie");
        medecin.setEmail("dr.martin@hospital.com");
        medecin.setRole("SOIGNANT");
        medecin.setActif(true);
        medecin.setTelephone("0123456789");
        
        // Supprimer tous les anciens médecins
        List<Soignant> existingSoignants = userService.getAllSoignants();
        existingSoignants.forEach(s -> {
            // Dissocier les patients
            List<Patient> patients = userService.getPatientsBySoignant(s.getId());
            patients.forEach(p -> {
                p.setSoignant(null);
                patientRepository.save(p);
            });
            soignantRepository.delete(s);
        });
        
        // Sauvegarder le nouveau médecin
        Soignant finalMedecin = soignantRepository.save(medecin);
        
        // Récupérer tous les patients et les associer à ce médecin
        List<Patient> allPatients = patientRepository.findAll();
        allPatients.forEach(patient -> {
            patient.setSoignant(finalMedecin);
            patientRepository.save(patient);
        });
        
        return ResponseEntity.ok(Map.of(
            "message", "Configuration terminée : 1 médecin créé, tous les patients associés",
            "medecin", Map.of(
                "id", finalMedecin.getId(),
                "nom", finalMedecin.getNom(),
                "prenom", finalMedecin.getPrenom(),
                "email", finalMedecin.getEmail()
            ),
            "patientsCount", allPatients.size()
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Erreur lors de la configuration: " + e.getMessage()
        ));
    }
}

@GetMapping("/patient/{patientId}/soignant")
public ResponseEntity<Map<String, Object>> getSoignantByPatient(@PathVariable Long patientId) {
    Patient patient = userService.getPatientById(patientId);
    if (patient == null) {
        return ResponseEntity.notFound().build();
    }
    
    if (patient.getSoignant() == null) {
        // Return first available soignant if patient has none assigned
        List<Soignant> soignants = userService.getAllSoignants();
        if (!soignants.isEmpty()) {
            Soignant defaultSoignant = soignants.get(0);
            return ResponseEntity.ok(Map.of(
                "id", (Object) defaultSoignant.getId(),
                "nom", (Object) defaultSoignant.getNom(),
                "prenom", (Object) defaultSoignant.getPrenom(),
                "email", (Object) (defaultSoignant.getEmail() != null ? defaultSoignant.getEmail() : ""),
                "specialite", (Object) (defaultSoignant.getSpecialite() != null ? defaultSoignant.getSpecialite() : "")
            ));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    Soignant soignant = patient.getSoignant();
    return ResponseEntity.ok(Map.of(
        "id", (Object) soignant.getId(),
        "nom", (Object) soignant.getNom(),
        "prenom", (Object) soignant.getPrenom(),
        "email", (Object) (soignant.getEmail() != null ? soignant.getEmail() : ""),
        "specialite", (Object) (soignant.getSpecialite() != null ? soignant.getSpecialite() : "")
    ));
}

@GetMapping("/patient/{patientId}/tests")
    public ResponseEntity<List<PatientTestAssign>> getTestsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(assignationService.getAssignationsByPatient(patientId));
    }

    @GetMapping("/aidant/{accompagnantId}/a-faire")
    public ResponseEntity<List<PatientTestAssign>> getByAidant(@PathVariable Long accompagnantId) {
        return ResponseEntity.ok(assignationService.getAssignationsByAidant(accompagnantId));
    }

    @GetMapping("/aidant/{accompagnantId}/planning")
    public ResponseEntity<List<AidantPlanningItemDto>> getPlanningByAidant(@PathVariable Long accompagnantId) {
        List<AidantPlanningItemDto> dto = assignationService.getPlanningByAidant(accompagnantId).stream()
                .map(a -> new AidantPlanningItemDto(
                        a.getId(),
                        a.getPatientId(),
                        a.getAccompagnantId(),
                        a.getSoignantId(),
                        a.getTest() != null ? a.getTest().getId() : null,
                        a.getTest() != null ? a.getTest().getTitre() : null,
                        a.getTest() != null && a.getTest().getType() != null ? a.getTest().getType().name() : null,
                        a.getStatus() != null ? a.getStatus().name() : null,
                        a.getDateAssignation(),
                        a.getDateLimite()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/demarrer/{assignId}")
    public ResponseEntity<TestResult> start(@PathVariable Long assignId, @RequestParam Long accompagnantId) {
        return ResponseEntity.ok(assignationService.startTest(assignId, accompagnantId));
    }

    @PostMapping("/terminer/{resultId}")
    public ResponseEntity<TestResult> finish(@PathVariable Long resultId,
            @RequestBody Map<String, Object> payload) {
        List<TestAnswer> answers = (List<TestAnswer>) payload.get("answers");
        String observations = (String) payload.get("observations");
        return ResponseEntity.ok(assignationService.finishTest(resultId, answers, observations));
    }
}
