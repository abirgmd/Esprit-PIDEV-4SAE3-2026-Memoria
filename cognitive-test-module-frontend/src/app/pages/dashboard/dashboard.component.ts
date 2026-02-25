import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Tag, RefreshCw, ShoppingBag, TrendingUp, TrendingDown, Users, ClipboardCheck, AlertCircle, Calendar } from 'lucide-angular';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { ProgressCircleComponent } from '../../components/progress-circle/progress-circle.component';
import { CognitiveTestService } from '../../services/cognitive-test.service';
import { TestResultService } from '../../services/test-result.service';
import { PatientAssignmentService } from '../../services/patient-assignment.service';
import { AssignationService } from '../../services/assignation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    MetricCardComponent,
    ProgressCircleComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private testService = inject(CognitiveTestService);
  private resultService = inject(TestResultService);
  private assignmentService = inject(PatientAssignmentService);
  private assignationService = inject(AssignationService);
  private router = inject(Router);

  // Metrics Signals
  totalTests = signal(0);
  activePatients = signal(0);
  completedTests = signal(0);
  pendingAssignments = signal(0);
  
  // Dashboard data
  medecinData = signal<any>(null);
  patientsList = signal<any[]>([]);
  isLoading = signal(true);

  readonly icons = {
    Users,
    ClipboardCheck,
    AlertCircle,
    Calendar,
    TrendingUp,
    TrendingDown,
    ShoppingCart // Keeping for compatibility if needed, but unused
  };

  chartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    arts: [4, 6, 3, 7, 5, 2, 8], // Mock activity data
    commerce: [2, 4, 2, 5, 3, 1, 4]
  };

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    
    // Charger tous les patients avec leur médecin
    this.assignationService.getAllPatientsWithMedecin().subscribe({
      next: (patients) => {
        this.patientsList.set(patients);
        this.activePatients.set(patients.length);
        
        // Prendre le premier médecin comme exemple (ou vous pouvez ajouter une logique pour sélectionner le médecin connecté)
        if (patients.length > 0 && patients[0].medecin) {
          const medecinId = patients[0].medecin.id;
          this.loadMedecinDashboard(medecinId);
        } else {
          this.isLoading.set(false);
        }
        
        // Charger les autres métriques
        this.loadMetrics();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des patients:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadMedecinDashboard(medecinId: number) {
    this.assignationService.getMedecinDashboard(medecinId).subscribe({
      next: (dashboard) => {
        this.medecinData.set(dashboard);
        console.log('Dashboard médecin:', dashboard);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du dashboard médecin:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadMetrics() {
    // 1. Total available tests
    this.testService.getAll().subscribe({
      next: (tests) => this.totalTests.set(tests.length),
      error: (e) => console.error(e)
    });

    // 2. Completed tests (Results)
    this.resultService.getAll().subscribe({
      next: (results) => this.completedTests.set(results.length),
      error: (e) => console.error(e)
    });

    // 3. Pending assignments
    this.assignmentService.getAll().subscribe({
      next: (assignments) => {
        const pending = assignments.filter(a => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS');
        this.pendingAssignments.set(pending.length);
      },
      error: (e) => console.error(e)
    });
  }

  getMedecinName(): string {
    const medecin = this.medecinData();
    if (!medecin || !medecin.medecin) return 'Non connecté';
    return `Dr. ${medecin.medecin.prenom} ${medecin.medecin.nom}`;
  }

  getMedecinSpecialite(): string {
    const medecin = this.medecinData();
    if (!medecin || !medecin.medecin) return '';
    return medecin.medecin.specialite || '';
  }

  getTotalPatients(): number {
    const stats = this.medecinData()?.statistics;
    return stats?.totalPatients || this.activePatients();
  }

  getTotalTestsForMedecin(): number {
    const stats = this.medecinData()?.statistics;
    return stats?.totalTests || 0;
  }

  getCompletedTestsForMedecin(): number {
    const stats = this.medecinData()?.statistics;
    return stats?.completedTests || 0;
  }

  getInProgressTestsForMedecin(): number {
    const stats = this.medecinData()?.statistics;
    return stats?.inProgressTests || 0;
  }

  getRecentPatients(): any[] {
    return this.medecinData()?.recentPatients || [];
  }

  // Helper methods for template calculations
  getEngagedPatients(): number {
    return Math.round(this.getTotalPatients() * 0.85);
  }

  getNewPatients(): number {
    return Math.round(this.getTotalPatients() * 0.15);
  }

  getTestCompletionPercentage(): number {
    const total = this.getTotalTestsForMedecin();
    const completed = this.getCompletedTestsForMedecin();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  asPolylinePoints(data: number[]): string {
    return data.map((val, i) => `${60 + i * 85},${210 - val * 10}`).join(' '); // Adjusted scale
  }

  // Open test method for navigation
  openTest(test: any) {
    this.router.navigate(['/cognitive-test', test.id], {
      state: { test: test }
    });
  }
}

