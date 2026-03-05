import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { PatientDetailComponent } from './pages/patient-detail/patient-detail.component';
import { TestsCognitifsComponent } from './pages/tests-cognitifs/tests-cognitifs.component';
import { GestionTestsComponent } from './pages/gestion-tests/gestion-tests.component';
import { PersonalizedTestFormComponent } from './pages/personalized-test-form/personalized-test-form.component';
import { TestResultsComponent } from './pages/test-results/test-results.component';
import { AnalysesComponent } from './pages/analyses/analyses.component';
import { CalendarViewComponent } from './pages/calendar-view/calendar-view.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { TestRunnerComponent } from './pages/test-runner/test-runner.component';
import { Test5MotsComponent } from './pages/test-5mots/test-5mots.component';
import { TestVisagesComponent } from './pages/test-visages/test-visages.component';
import { MotsCroisesComponent } from './pages/mots-croises/mots-croises.component';
import { TestMmseComponent } from './pages/test-mmse/test-mmse.component';
import { TestOrientationSimplifieComponent } from './pages/test-orientation-simplifie/test-orientation-simplifie.component';
import { TestPuzzlesSimplesComponent } from './pages/test-puzzles-simples/test-puzzles-simples.component';
import { TestReconnaissanceProchesComponent } from './pages/test-reconnaissance-proches/test-reconnaissance-proches.component';
import { TestTriCategoriesComponent } from './pages/test-tri-categories/test-tri-categories.component';
import { TriObjetsComponent } from './pages/tri-objets/tri-objets.component';
import { AidantMetricsComponent } from './pages/aidant-metrics/aidant-metrics.component';
import { MedecinMetricsComponent } from './pages/medecin-metrics/medecin-metrics.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'patients/:id', component: PatientDetailComponent },
      { path: 'tests-cognitifs', component: TestsCognitifsComponent },
      { path: 'personalized-test', component: PersonalizedTestFormComponent },
      { path: 'gestion-tests', component: GestionTestsComponent },

      { path: 'cognitive-test/1', component: TestMmseComponent },
      { path: 'cognitive-test/10', component: TestOrientationSimplifieComponent },
      { path: 'cognitive-test/17', component: TestPuzzlesSimplesComponent },
      { path: 'cognitive-test/19', component: TestTriCategoriesComponent },
      { path: 'cognitive-test/20', component: TestReconnaissanceProchesComponent },
      { path: 'cognitive-test/27', component: TriObjetsComponent }, // Test tri d'objets ID 27
      { path: 'cognitive-test/6', component: MotsCroisesComponent }, // Test mots croisés ID 6
      { path: 'cognitive-test/:testId', component: TestRunnerComponent },
      { path: 'test-5mots', component: Test5MotsComponent },
      { path: 'test-visages', component: TestVisagesComponent },
      { path: 'test-mots-croises', component: MotsCroisesComponent },
      { path: 'test-tri-objets', component: TriObjetsComponent },

      { path: 'analyses', component: AnalysesComponent },
      { path: 'calendar', component: CalendarViewComponent },
      { path: 'aidant-metrics', component: AidantMetricsComponent },
      { path: 'medecin-metrics', component: MedecinMetricsComponent },
      { path: 'activites', component: ActivitiesComponent },

      // Test Results Route
      { path: 'test-results/:sessionId', component: TestResultsComponent },

      { path: '**', redirectTo: 'dashboard' },
    ]
  },
];
