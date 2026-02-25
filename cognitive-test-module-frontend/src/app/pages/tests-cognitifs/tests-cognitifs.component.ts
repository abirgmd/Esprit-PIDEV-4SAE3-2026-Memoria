import { Component, signal, effect, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Brain, MessageSquare, Compass, Plus, Activity, Stethoscope, Users, UserCircle, ChevronRight, Calendar, AlertTriangle, TrendingDown, FileText, FlaskConical, ClipboardList, BarChart3, BookOpen, Phone, Users2, CheckCircle2, Clock, Info, ExternalLink, Search, X, Volume2, Pencil, Play } from 'lucide-angular';
import { CognitiveTestService } from '../../services/cognitive-test.service';
import { TestResultService } from '../../services/test-result.service';
import { AssignationService } from '../../services/assignation.service';
import { MmseScoreService, MMSEScoreResponse } from '../../services/mmse-score.service';
import { CognitiveTest, TestResult, DifficultyLevel, PatientDTO, AccompagnantDTO, AssignationRequest } from '../../models/cognitive-models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-tests-cognitifs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './tests-cognitifs.component.html',
  styleUrl: './tests-cognitifs.component.css'
})
export class TestsCognitifsComponent implements OnInit {
  private cognitiveTestService = inject(CognitiveTestService);
  private testResultService = inject(TestResultService);
  private assignationService = inject(AssignationService);
  private mmseScoreService = inject(MmseScoreService);
  router = inject(Router);

  showNewTestModal = signal(false);
  // MMSE score dynamique pour aidant et patient
  aidantPatientMmseScore = signal<MMSEScoreResponse | null>(null);
  patientMmseScore = signal<MMSEScoreResponse | null>(null);
  selectedRole = signal<string | null>(null);

  // New Test Form State
  searchQuery = signal('');
  selectedPatientId = signal<string | null>(null);
  testStage = signal<'STABLE' | 'MOYEN' | 'CRITIQUE' | null>(null);
  selectedTestId = signal<string | null>(null);
  testDeadline = signal('');
  testNotes = signal('');

  availableTests = signal<CognitiveTest[]>([]);
  recentResults = signal<any[]>([]);
  patientsList = signal<PatientDTO[]>([]);
  aidantsList = signal<AccompagnantDTO[]>([]);
  patientAssignments = signal<any[]>([]);
  doctorAssignments = signal<any[]>([]);
  mockAssignments: any[] = JSON.parse(localStorage.getItem('mockAssignments') || '[]'); // Store local mock assignments for demo purposes
  showDoctorAssignmentsModal = signal(false);
  selectedPatientForDashboard = signal<any>(null); // Stores the selected patient object

  // Selection Modal State
  showSelectionModal = signal(false);
  selectionType = signal<'PATIENT' | 'AIDANT' | null>(null);
  selectedPersonId = signal<number | null>(null);
  activeAidantId = signal<number | null>(null);

  readonly icons = {
    Brain,
    MessageSquare,
    Compass,
    Plus,
    Activity,
    Stethoscope,
    Users,
    UserCircle,
    ChevronRight,
    Calendar,
    AlertTriangle,
    TrendingDown,
    FileText,
    FlaskConical,
    ClipboardList,
    BarChart: BarChart3,
    BookOpen,
    Phone,
    Users2,
    CheckCircle2,
    Clock,
    Info,
    ExternalLink,
    Search,
    XMark: X,
    Volume2,
    Play
  };

  dashboardStats = {
    totalPatients: 23,
    newThisMonth: 3,
    stage1: 12,
    stage2: 8,
    stage3: 3
  };

  criticalAlerts = [
    { name: 'Pierre Martin', stage: 'STAGE 3 — CRITIQUE', score: '14/30', trend: '-5 pts', alerts: 3, color: 'red' },
    { name: 'Anne Petit', stage: 'STAGE 3 — CRITIQUE', score: '16/30', trend: '-4 pts', alerts: 2, color: 'pink' }
  ];

  recentDecisions = [
    { patient: 'Pierre Martin', status: 'CRITIQUE', urgency: 'URGENCE', description: 'Déclin rapide détecté - Score passé de 19 à 14 en 1 mois. Intervention immédiate recommandée.', type: 'HYBRID', date: '08/02/2026' },
    { patient: 'Jean Dupont', status: 'MOYEN', urgency: 'SURVEILLANCE', description: 'Léger déclin observé. Surveillance renforcée recommandée.', type: 'RULE BASED', date: '15/02/2026' }
  ];

  // Aidant Mock Data
  aidantData = {
    patientName: 'Robert Lefebvre',
    patientId: 36,
    patientAge: 85,
    stage: 'STAGE 2 — SURVEILLANCE',
    currentScore: '22/30',
    percentage: 73.3,
    trend: 'Déclin -2 pts',
    nextTest: '29/03/2026',
    statusMessage: 'Surveillance renforcée',
    statusDesc: 'Score en baisse de 2 points ce mois. Suivez bien les recommandations du médecin.',
    tasks: [
      { id: 1, title: 'Appeler le médecin', urgency: 'URGENTE', date: '17/02/2026', color: 'red' },
      { id: 2, title: 'Exercices mémoire quotidiens', urgency: 'ÉLEVÉE', date: '17/02/2026', color: 'yellow' },
      { id: 3, title: 'Préparer cahier de suivi', urgency: 'MOYENNE', date: '20/02/2026', color: 'blue' }
    ],
    appointment: {
      date: '25 Février 2026',
      time: '10h00',
      description: 'Test Cognitif + Consultation',
      location: 'Cabinet Dr. Martin'
    },
    resources: [
      { title: "Guide de l'aidant", desc: 'Conseils et bonnes pratiques', icon: BookOpen },
      { title: "Ligne d'urgence", desc: '0800 XXX XXX (24/7)', icon: Phone },
      { title: 'Groupe de soutien', desc: 'Rejoindre la communauté', icon: Users2 }
    ]
  };

  // Patient Mock Data
  patientData = {
    stage: 'STAGE 2 — SURVEILLANCE',
    currentScore: '22/30',
    percentage: 73.3,
    doctorNote: 'Votre médecin suit votre mémoire de près. Ce n’est PAS une maladie grave. C’est une surveillance préventive. Faites vos exercices quotidiens et passez les tests demandés.',
    testsToDo: [
      { title: 'Test de Stroop', desc: 'Évaluation de l’attention sélective et de l’inhibition cognitive', duration: '10 min', deadline: '29/03/2026' }
    ],
    recommendations: [
      { title: 'Exercices de mémoire quotidiens', desc: '15 minutes par jour d’exercices cognitifs', icon: Brain },
      { title: 'Rendez-vous médical', desc: 'Consultation de suivi le 25 février', icon: Stethoscope }
    ],
    nextAppointment: {
      date: '25 Février 2026 à 10h00',
      location: 'Cabinet Dr. Martin'
    }
  };

  // Reactive signals for patient data
  // patientsList is already defined at line 42

  get filteredPatients() {
    const query = this.searchQuery().toLowerCase();
    const patients = this.patientsList();
    if (!query) return [];
    return patients.filter(p =>
      (p.nom?.toLowerCase().includes(query) || p.prenom?.toLowerCase().includes(query))
    );
  }

  get selectedPatientData() {
    return this.patientsList().find(p => p.id.toString() === this.selectedPatientId());
  }

  selectedTestType = signal<string | null>(null);

  // Personalized tests filled by the doctor
  personalizedTests: { STABLE: { name: string; selected: boolean }[]; MOYEN: { name: string; selected: boolean }[]; CRITIQUE: { name: string; selected: boolean }[] } = {
    STABLE: [
      { name: 'Mémoire des visages personnalisée', selected: false },
      { name: 'Mots croisés personnalisés', selected: false }
    ],
    MOYEN: [
      { name: 'Memory personnalisé', selected: false },
      { name: 'Reconnaissance d\'odeurs personnalisée', selected: false }
    ],
    CRITIQUE: [
      { name: 'Reconnaissance des proches personnalisée', selected: false },
      { name: 'Chansons personnalisées', selected: false }
    ]
  };

  // Helper to map UI stage to numeric difficulty level
  private getDifficultyFromStage(stage: string): DifficultyLevel {
    const stageDifficultyMap: Record<string, DifficultyLevel> = {
      'STABLE': DifficultyLevel.FACILE,
      'MOYEN': DifficultyLevel.MOYEN,
      'CRITIQUE': DifficultyLevel.AVANCE
    };
    return stageDifficultyMap[stage];
  }

  readonly typeLabels: Record<string, string> = {
    'MEMORY': 'MEMORY (Tests de mémoire)',
    'LANGUAGE': 'LANGUAGE (Tests de langage)',
    'REFLECTION': 'REFLECTION (Tests de réflexion)',
    'LOGIC': 'LOGIC (Tests de logique)',
    'AUDIO': 'AUDIO (Tests sonores)',
    'ATTENTION': 'ATTENTION (Tests d\'attention)',
    'DRAWING': 'DRAWING (Tests de dessin)'
  };

  get groupedTestsHierarchy() {
    const tests = this.availableTests();
    const stages: { id: 'STABLE' | 'MOYEN' | 'CRITIQUE', label: string, difficulty: DifficultyLevel }[] = [
      { id: 'STABLE', label: 'STABLE (Facile)', difficulty: DifficultyLevel.FACILE },
      { id: 'MOYEN', label: 'MOYEN (Intermédiaire)', difficulty: DifficultyLevel.MOYEN },
      { id: 'CRITIQUE', label: 'CRITIQUE (Avancé)', difficulty: DifficultyLevel.AVANCE }
    ];

    return stages.map(stage => {
      const testsInStage = tests.filter(t => t.difficultyLevel === stage.difficulty);
      const uniqueTypes = [...new Set(testsInStage.map(t => t.type))];

      const categories = uniqueTypes.map(type => ({
        type,
        label: this.typeLabels[type] || type,
        tests: testsInStage.filter(t => t.type === type)
      }));

      return {
        ...stage,
        categories
      };
    });
  }

  get availableTestTypes() {
    const stage = this.testStage();
    if (!stage) return [];

    const targetDifficulty = this.getDifficultyFromStage(stage);

    // Filter tests by difficulty
    const tests = this.availableTests().filter(t =>
      t.difficultyLevel === targetDifficulty
    );

    // Get unique types
    const types = [...new Set(tests.map(t => t.type))];
    return types;
  }

  get availableSpecificTests() {
    const stage = this.testStage();
    const type = this.selectedTestType();

    if (!stage || !type) return [];

    const targetDifficulty = this.getDifficultyFromStage(stage);

    return this.availableTests().filter(t =>
      t.difficultyLevel === targetDifficulty &&
      t.type === type
    );
  }

  isFormValid() {
    return this.selectedPatientId() && this.testStage() && this.selectedTestType() && this.selectedTestId() && this.testDeadline();
  }

  // Helper to map test type to color/icon
  getTestStyle(type: string) {
    switch (type) {
      case 'MEMORY': return { color: 'blue', icon: Brain };
      case 'LANGUAGE': return { color: 'green', icon: MessageSquare };
      case 'LOGIC': return { color: 'indigo', icon: Activity };
      case 'REFLECTION': return { color: 'purple', icon: Activity };
      case 'AUDIO': return { color: 'pink', icon: Volume2 };
      case 'ATTENTION': return { color: 'teal', icon: Activity };
      case 'DRAWING': return { color: 'orange', icon: Pencil };
      default: return { color: 'purple', icon: Activity };
    }
  }

  constructor() {
    effect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.showNewTestModal()) {
          this.handleCloseModal();
        }
      };

      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadTests();
    this.loadDoctorAssignments();
    // Charger le score MMSE pour patient (aidant sera chargé plus tard)
    this.loadMmseScoreForPatient();
  }

  loadMmseScoreForAidant() {
    // Récupérer le patientId de l’aidant actif (si disponible)
    const aidantId = this.activeAidantId();
    if (!aidantId) return;
    // Chercher l’assignment de l’aidant pour récupérer le patientId
    this.assignationService.getAllAssignations().pipe(
      catchError(() => of([]))
    ).subscribe((assignments: any[]) => {
      const assignment = assignments.find((a: any) => a.accompagnantId === aidantId && a.patientId);
      if (assignment && assignment.patientId) {
        this.mmseScoreService.getLatestMMSEScore(assignment.patientId.toString()).subscribe({
          next: (score) => this.aidantPatientMmseScore.set(score),
          error: (err) => console.error('Erreur chargement score MMSE aidant', err)
        });
      }
    });
  }

  loadMmseScoreForPatient() {
    const patient = this.selectedPatientForDashboard();
    if (!patient) return;
    this.mmseScoreService.getLatestMMSEScore(patient.id.toString()).subscribe({
      next: (score) => this.patientMmseScore.set(score),
      error: (err) => console.error('Erreur chargement score MMSE patient', err)
    });
  }

  loadPatients() {
    // Utiliser notre nouvel endpoint pour récupérer tous les patients avec leur médecin
    this.assignationService.getAllPatientsWithMedecin().subscribe({
      next: (patients: any[]) => {
        // Convertir les patients au format attendu par le composant (sans typage strict)
        const formattedPatients = patients.map(p => ({
          id: p.id,
          nom: p.nom,
          prenom: p.prenom,
          email: p.email,
          dateNaissance: p.dateNaissance,
          sexe: p.sexe,
          adresse: p.adresse,
          role: 'PATIENT',
          actif: true,
          medecin: p.medecin
        }));
        this.patientsList.set(formattedPatients as any);
        console.log('[DEBUG] Patients chargés avec médecin:', formattedPatients);
      },
      error: (err) => {
        console.error('Error loading patients', err);
        // Fallback: créer des patients mock pour éviter l'erreur "aucun patient trouvé"
        const mockPatients = [
          {
            id: 92,
            nom: 'Lefebvre',
            prenom: 'Robert',
            email: 'robert.l@email.com',
            dateNaissance: '1942-03-15',
            sexe: 'M',
            adresse: '8 Rue de Rivoli, Paris',
            role: 'PATIENT',
            actif: true,
            medecin: {
              id: 55,
              nom: 'Oussama',
              prenom: 'Dr. Sophie',
              email: 'dr.oussama@hospital.com',
              specialite: 'Médecine Générale'
            }
          },
          {
            id: 93,
            nom: 'Moreau',
            prenom: 'Marguerite',
            email: 'margot.m@email.com',
            dateNaissance: '1938-11-02',
            sexe: 'F',
            adresse: '24 Avenue Mozart, Lyon',
            role: 'PATIENT',
            actif: true,
            medecin: {
              id: 55,
              nom: 'Oussama',
              prenom: 'Dr. Sophie',
              email: 'dr.oussama@hospital.com',
              specialite: 'Médecine Générale'
            }
          }
        ];
        this.patientsList.set(mockPatients as any);
        console.log('[DEBUG] Patients mock chargés:', mockPatients);
      }
    });
  }

  loadAidants() {
    console.log('[DEBUG] loadAidants() called');
    this.assignationService.getAllAidants().subscribe({
      next: (aidants) => {
        console.log('[DEBUG] getAllAidants() response:', aidants);
        if (Array.isArray(aidants) && aidants.length > 0) {
          this.aidantsList.set(aidants);
          console.log('[DEBUG] Aidants chargés:', aidants);
          console.log('[DEBUG] aidantsList signal:', this.aidantsList());
        } else {
          console.log('[DEBUG] No aidants returned, using fallback');
          const mockAidant: any = {
            id: 16,
            nom: 'Martin',
            prenom: 'Sophie',
            email: 'sophie.martin@email.com',
            role: 'AIDANT',
            actif: true
          };
          this.aidantsList.set([mockAidant]);
          console.log('[DEBUG] Aucun aidant trouvé, fallback mock:', mockAidant);
        }
      },
      error: (err) => {
        console.error('Error loading aidants', err);
        const mockAidant: any = {
          id: 16,
          nom: 'Martin',
          prenom: 'Sophie',
          email: 'sophie.martin@email.com',
          role: 'AIDANT',
          actif: true
        };
        this.aidantsList.set([mockAidant]);
        console.log('[DEBUG] Aidants mock chargés (fallback):', mockAidant);
      }
    });
  }

  loadDoctorAssignments() {
    // Récupérer d'abord tous les patients pour trouver un médecin
    this.assignationService.getAllPatientsWithMedecin().subscribe({
      next: (patients) => {
        if (patients.length > 0 && patients[0].medecin) {
          const medecinId = patients[0].medecin.id;
          console.log('[DEBUG] Using medecinId:', medecinId);

          // Utiliser l'ID du médecin trouvé
          this.assignationService.getAssignationsByMedecin(medecinId).pipe(
            catchError(() => of([]))
          ).subscribe((assignments) => {
            // Merge real backend data with local mock data
            const mocks = this.mockAssignments.filter(a => a.soignantId === medecinId);
            this.doctorAssignments.set([...assignments, ...mocks]);
            console.log('[DEBUG] Assignations médecin chargées (Merged):', this.doctorAssignments());
          });
        } else {
          console.warn('[DEBUG] Aucun médecin trouvé parmi les patients');
          this.doctorAssignments.set([]);
        }
      },
      error: (err) => {
        console.error('Error loading patients for doctor assignments', err);
        // Fallback: utiliser l'ancien ID codé en dur
        this.assignationService.getAssignationsByMedecin(16).pipe(
          catchError(() => of([]))
        ).subscribe((assignments) => {
          const mocks = this.mockAssignments.filter(a => a.soignantId === 16);
          this.doctorAssignments.set([...assignments, ...mocks]);
          console.log('[DEBUG] Assignations médecin chargées (fallback):', this.doctorAssignments());
        });
      }
    });
  }

  getPatientName(patientId: number): string {
    const patient = this.patientsList().find(p => p.id === patientId);
    return patient ? `${patient.prenom} ${patient.nom}` : `Patient #${patientId}`;
  }

  openSelectionModal(type: 'PATIENT' | 'AIDANT') {
    console.log('[DEBUG] openSelectionModal called with type:', type);
    this.selectionType.set(type);
    this.showSelectionModal.set(true);
    // Recharger la liste correspondante pour garantir qu’elle est à jour
    if (type === 'AIDANT') {
      console.log('[DEBUG] Loading aidants...');
      this.loadAidants();
    } else {
      console.log('[DEBUG] Loading patients...');
      this.loadPatients();
    }
  }

  handleCloseSelectionModal() {
    this.showSelectionModal.set(false);
    this.selectionType.set(null);
    this.selectedPersonId.set(null);
  }

  confirmSelection() {
    const type = this.selectionType();
    const id = this.selectedPersonId();
    if (!type || !id) return;

    if (type === 'PATIENT') {
      const patient = this.patientsList().find(p => p.id === id);
      if (patient) {
        this.selectedPatientForDashboard.set(patient); // Store the full patient object
        this.selectedRole.set('patient');
        this.loadPatientAssignments(id);
      }
    } else if (type === 'AIDANT') {
      const aidant = this.aidantsList().find(a => a.id === id);
      if (aidant) {
        this.activeAidantId.set(id);
        // Mettre à jour les données de l’aidant avec les vraies données
        this.aidantData.patientName = `${aidant.prenom} ${aidant.nom}`;
        this.aidantData.patientId = aidant.id;
        // Utiliser une valeur par défaut pour l’âge car AccompagnantDTO n'a pas de dateNaissance
        this.aidantData.patientAge = 75; // Valeur par défaut pour la démo
        this.selectedRole.set('aidant');

        // Charger les tests du patient lié à cet aidant via le nouvel endpoint
        this.loadAidantPatientTests(id);
        // Charger le score MMSE du patient lié à cet aidant
        this.loadMmseScoreForAidant();
      }
    }
    this.handleCloseSelectionModal();
  }

  // Méthode pour trouver le patient associé à un aidant
  findPatientForAidant(aidantId: number) {
    // Charger toutes les assignments pour trouver celle qui contient cet aidant
    this.assignationService.getAllAssignations().subscribe({
      next: (allAssignments: any[]) => {
        // Chercher une assignment où cet aidant est l'accompagnant
        const assignmentWithAidant = allAssignments.find((assign: any) =>
          assign.accompagnantId === aidantId && assign.patientId
        );

        if (assignmentWithAidant) {
          // Trouver le patient associé
          const patient = this.patientsList().find(p => p.id === assignmentWithAidant.patientId);
          if (patient) {
            console.log('[DEBUG] Aidant', aidantId, 'associé au patient', patient.prenom, patient.nom);
            // Mettre à jour le nom du patient suivi
            this.aidantData.patientName = `${patient.prenom} ${patient.nom}`;
            this.aidantData.patientAge = this.calculateAge(patient.dateNaissance || '');
            // Charger les assignments de ce patient (l'aidant voit les mêmes tests)
            this.loadPatientAssignments(patient.id);
          }
        } else {
          // Fallback: utiliser le premier patient disponible pour la démo
          console.log('[DEBUG] Aucune assignment trouvée pour l\'aidant', aidantId, '- utilisation du premier patient');
          const firstPatient = this.patientsList()[0];
          if (firstPatient) {
            this.aidantData.patientName = `${firstPatient.prenom} ${firstPatient.nom}`;
            this.aidantData.patientAge = this.calculateAge(firstPatient.dateNaissance || '');
            this.loadPatientAssignments(firstPatient.id);
          }
        }
      },
      error: (err: any) => {
        console.error('Error finding patient for aidant', err);
        // Fallback: utiliser le premier patient
        const firstPatient = this.patientsList()[0];
        if (firstPatient) {
          this.aidantData.patientName = `${firstPatient.prenom} ${firstPatient.nom}`;
          this.loadPatientAssignments(firstPatient.id);
        }
      }
    });
  }

  // Helper pour calculer l'âge à partir de la date de naissance
  calculateAge(dateNaissance: string): number {
    if (!dateNaissance) return 75; // Valeur par défaut
    const birth = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  loadPatientAssignments(patientId: number) {
    this.assignationService.getAssignationsByPatient(patientId).pipe(
      catchError(() => of([]))
    ).subscribe((realAssignments) => {
      let allAssignments = [...realAssignments];

      // Merge Mock Assignments
      const localMocks = this.mockAssignments.filter(a => Number(a.patientId) === Number(patientId));
      allAssignments = [...allAssignments, ...localMocks];

      // DEMO MAPPING: If Robert (36), also fetch Demo Data (ID 1)
      if (patientId === 36) {
        this.assignationService.getAssignationsByPatient(1).pipe(
          catchError(() => of([]))
        ).subscribe((demoData) => {
          // Ensure unique IDs (avoid duplicates if backend returns intersection)
          const existingIds = new Set(allAssignments.map(a => a.id));
          const uniqueDemoData = demoData.filter(d => !existingIds.has(d.id));

          this.patientAssignments.set([...allAssignments, ...uniqueDemoData]);
          console.log('[DEBUG] Assignations patient merged (Real+Mock+Demo):', this.patientAssignments());
        });
      } else {
        this.patientAssignments.set(allAssignments);
      }
    });
  }

  loadAidantPatientTests(aidantId: number) {
    this.assignationService.getAidantPatientTests(aidantId).pipe(
      catchError(() => of([]))
    ).subscribe((dtoList) => {
      // Mapper le DTO AidantPatientTestDto au format attendu par le template
      const mapped = dtoList.map((dto: any) => ({
        id: dto.patientId, // Utiliser patientId comme identifiant d'assignment pour l'affichage
        patientId: dto.patientId,
        patientName: dto.patientName,
        test: {
          id: dto.testId,
          titre: dto.testName,
          type: null // Le DTO ne retourne pas le type; le template gère le fallback
        },
        status: dto.status,
        dateAssignation: dto.assignedDate,
        dateLimite: null,
        instructions: null
      }));

      this.patientAssignments.set(mapped);
      console.log('[DEBUG] Assignations aidant chargées (DTO):', this.patientAssignments());

      // Mettre à jour les données affichées si le premier élément contient un nom de patient
      if (mapped.length > 0 && mapped[0].patientName) {
        this.aidantData.patientName = mapped[0].patientName;
      }
    });
  }

  loadTests() {
    this.cognitiveTestService.getAll().subscribe({
      next: (tests) => {
        console.log('[DEBUG] Tests chargés depuis le backend:', tests);
        this.availableTests.set(tests);
      },
      error: (err) => console.error('Error loading tests', err)
    });
  }

  loadRecentResults() {
    // Ideally we'd have a specific endpoint for "recent results" across all patients
    // For now, we'll mock it or fetch for a specific patient if we had one selected
    // But since this is a general view, we might need a new endpoint in backend or just map manually 
    // from a specific patient for demo purposes (e.g. patient 101)

    // Using Patient ID 1 (Robert) for demo purposes
    this.testResultService.getByPatient(1).subscribe({
      next: (results) => {
        const mappedResults = results.map(r => ({
          patient: 'Marie Dubois', // Mock name matching ID 101
          test: r.test?.titre || 'Test Inconnu',
          date: r.testDate,
          score: r.scoreTotale,
          duration: r.durationSeconds ? `${Math.floor(r.durationSeconds / 60)} min` : 'N/A'
        }));
        this.recentResults.set(mappedResults);
      },
      error: (err) => console.error('Error loading results', err)
    });
  }

  handleCloseModal() {
    this.showNewTestModal.set(false);
    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  resetForm() {
    this.searchQuery.set('');
    this.selectedPatientId.set(null);
    this.testStage.set(null);
    this.selectedTestType.set(null);
    this.selectedTestId.set(null);
    this.testDeadline.set('');
    this.testNotes.set('');
  }

  selectTestFromHierarchy(stageId: 'STABLE' | 'MOYEN' | 'CRITIQUE', type: string, testTitre: string) {
    this.testStage.set(stageId);
    this.selectedTestType.set(type);
    this.selectedTestId.set(testTitre);
  }

  togglePersonalizedTest(stage: 'STABLE' | 'MOYEN' | 'CRITIQUE', testName: string) {
    if (!this.selectedPatientId()) {
      alert('Veuillez d\'abord sélectionner un patient pour créer un test personnalisé.');
      return;
    }

    let type = '';
    if (testName.includes('visages')) type = 'FACES';
    else if (testName.includes('Mots croisés')) type = 'CROSSWORDS';
    else if (testName.includes('Memory')) type = 'MEMORY';
    else if (testName.includes('odeurs')) type = 'SCENTS';
    else if (testName.includes('proches')) type = 'RELATIVES';
    else if (testName.includes('Chansons')) type = 'SONGS';

    if (type) {
      const patient = this.selectedPatientData; // Getter logic
      const patientName = patient ? `${patient.prenom} ${patient.nom}` : 'Patient';

      this.router.navigate(['/personalized-test'], {
        queryParams: {
          type,
          stage,
          patientId: this.selectedPatientId(),
          patientName: patientName
        }
      });
    }
  }

  handleAidantAssignmentClick(assignment: any): void {
    if (!assignment) return;

    const status = String(assignment.status || 'ASSIGNED');
    if (status === 'COMPLETED') return;

    const patientId = assignment.patientId || this.aidantData.patientId;
    const baseQueryParams = {
      testId: assignment.test?.id,
      patientId: patientId,
      assignationId: assignment.id
    };

    // Check if this is a 5 mots test
    if (assignment.test?.titre?.toLowerCase().includes('5 mots') || assignment.test?.id === 3) {
      this.router.navigate(['/test-5mots'], { queryParams: baseQueryParams });
      return;
    }

    // Check if this is a visages test
    if (assignment.test?.titre?.toLowerCase().includes('visages') || assignment.test?.id === 4) {
      this.router.navigate(['/test-visages'], { queryParams: baseQueryParams });
      return;
    }

    // Check if this is a mots croises test
    if (assignment.test?.titre?.toLowerCase().includes('mots croises') || assignment.test?.id === 6) {
      this.router.navigate(['/test-mots-croises'], { queryParams: baseQueryParams });
      return;
    }

    // Navigate to dedicated test components with patientId/assignationId
    const testId = assignment.test?.id ?? assignment.testId;
    if (testId) {
      this.router.navigate(['/cognitive-test', testId], { queryParams: { patientId, assignationId: assignment.id } });
      return;
    }

    // Fallback sur l'ancien mapping par type si pas d'ID disponible
    const type = String(assignment.test?.type || 'MEMORY');
    const route = this.mapAidantTestTypeToRoute(type);
    if (route) {
      this.router.navigate([route], { queryParams: { patientId, assignationId: assignment.id } });
      return;
    }

    alert(`Ce test (${type}) n'est pas encore relié à un écran de test.`);
  }

  private mapAidantTestTypeToRoute(type: string): string | null {
    switch (type) {
      case 'MEMORY':
        return '/test-memoire';
      case 'LANGUAGE':
        return '/test-language';
      default:
        return null;
    }
  }

  selectPatient(patient: PatientDTO) {
    this.selectedPatientId.set(patient.id.toString());
    this.searchQuery.set(`${patient.prenom} ${patient.nom}`);
  }

  handleAssignTest() {
    if (this.isFormValid()) {
      const selectedTest = this.availableTests().find(t => t.titre === this.selectedTestId());

      if (!selectedTest?.id) return;

      // Récupérer le patient sélectionné pour trouver son médecin
      const selectedPatient = this.selectedPatientData;
      let soignantId = 16; // Fallback

      if (selectedPatient && (selectedPatient as any).medecin) {
        soignantId = (selectedPatient as any).medecin.id;
        console.log('[DEBUG] Using patient medecinId:', soignantId);
      }

      const request: AssignationRequest = {
        patientId: Number(this.selectedPatientId()),
        testId: selectedTest.id,
        soignantId: soignantId,
        dateLimite: this.testDeadline(),
        instructions: this.testNotes()
      };

      console.log('[DEBUG] Sending AssignationRequest:', request);

      this.assignationService.createAssignation(request).subscribe({
        next: (res) => {
          console.log('Test assigned successfully:', res);
          this.handleCloseModal();
          this.loadDoctorAssignments(); // Refresh the assignments list
          // If we are currently viewing this patient as Patient, refresh patient view
          if (this.selectedPatientForDashboard()?.id === request.patientId) {
            this.loadPatientAssignments(request.patientId);
          }
        },
        error: (err) => {
          console.warn('Backend error (Simulation Mode Activated):', err);

          // Create Mock Assignment
          const mockAssign = {
            id: Date.now(), // Generate fake ID
            patientId: request.patientId,
            test: selectedTest,
            soignantId: request.soignantId,
            dateAssignation: new Date().toISOString(),
            dateLimite: request.dateLimite ? new Date(request.dateLimite).toISOString() : null,
            instructions: request.instructions,
            status: 'ASSIGNED'
          };

          this.mockAssignments.push(mockAssign);
          localStorage.setItem('mockAssignments', JSON.stringify(this.mockAssignments));

          // Show Success Feedback
          alert('Test assigné avec succès (Mode Démo - Sauvegardé localement)');

          this.handleCloseModal();
          this.loadDoctorAssignments(); // Show in doctor list

          // Refresh Patient View if active
          if (this.selectedPatientForDashboard()?.id === request.patientId) {
            this.loadPatientAssignments(request.patientId);
          }
        }
      });
    }
  }

  openCalendar() {
    const role = this.selectedRole();
    if (role === 'medecin') {
      this.router.navigate(['/calendar'], { queryParams: { medecinId: 16 } });
    } else if (role === 'patient') {
      const patientId = this.selectedPatientForDashboard()?.id;
      if (patientId) {
        this.router.navigate(['/calendar'], { queryParams: { patientId: patientId } });
      }
    } else if (role === 'aidant') {
      const aidantId = this.activeAidantId();
      if (aidantId) {
        this.router.navigate(['/calendar'], { queryParams: { aidantId: aidantId } });
      }
    } else {
      this.router.navigate(['/calendar']);
    }
  }

  startPatientTest(assignment: any): void {
    const patientId = this.selectedPatientForDashboard()?.id || assignment.patientId;
    const baseQueryParams = {
      testId: assignment.test?.id,
      patientId: patientId,
      assignationId: assignment.id
    };

    // Navigate to the appropriate test based on test type or ID
    if (assignment.test?.titre?.toLowerCase().includes('5 mots') || assignment.test?.id === 3) {
      this.router.navigate(['/test-5mots'], { queryParams: baseQueryParams });
    } else if (assignment.test?.titre?.toLowerCase().includes('visages') || assignment.test?.id === 4) {
      this.router.navigate(['/test-visages'], { queryParams: baseQueryParams });
    } else if (assignment.test?.titre?.toLowerCase().includes('mots croises') || assignment.test?.id === 6) {
      this.router.navigate(['/test-mots-croises'], { queryParams: baseQueryParams });
    } else {
      // Navigate to test component (routes for IDs 1,10,17,19,20 go to dedicated components)
      this.router.navigate(['/cognitive-test', assignment.test.id], {
        queryParams: { patientId, assignationId: assignment.id }
      });
    }
  }
}
