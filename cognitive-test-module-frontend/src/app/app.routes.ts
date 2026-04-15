import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { TestsCognitifsComponent } from './pages/tests-cognitifs/tests-cognitifs.component';
import { GestionTestsComponent } from './pages/gestion-tests/gestion-tests.component';
import { PersonalizedTestFormComponent } from './pages/personalized-test-form/personalized-test-form.component';
import { TestResultsComponent } from './pages/test-results/test-results.component';
import { CalendarViewComponent } from './pages/calendar-view/calendar-view.component';
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
import { AuthGuard } from './services/auth.guard';

export const APP_ROUTES: Routes = [
  // Default route - Login page
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Login route (no guard)
  { path: 'login', component: LoginComponent },

  // Protected routes
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tests-cognitifs', pathMatch: 'full' },
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

      { path: 'calendar', component: CalendarViewComponent },
      { path: 'aidant-metrics', component: AidantMetricsComponent },
      { path: 'medecin-metrics', component: MedecinMetricsComponent },

      // Test Results Route
      { path: 'test-results/:sessionId', component: TestResultsComponent },
    ]
  },

  // Default redirect to login for all undefined routes
  { path: '**', redirectTo: '/login' },
];
