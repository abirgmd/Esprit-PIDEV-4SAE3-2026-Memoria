import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';
import { RapportComponent } from './rapport/rapport.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { adminGuard } from './auth/admin.guard';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';
import { ProfilePatientComponent } from './profile-patient/profile-patient.component';
import { ProfileSoignantComponent } from './profile-soignant/profile-soignant.component';
import { ProfileAccompagnantComponent } from './profile-accompagnant/profile-accompagnant.component';
import { DashboardDiagnosticComponent } from './dashboard-diagnostic/dashboard-diagnostic.component';
import { StastiqueDiagnosticComponent } from './stastique-diagnostic/stastique-diagnostic.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MapComponent } from './map/map.component';
import { TraitementComponent } from './traitement/traitement.component';
import { HistoriquePositionComponent } from './historique-position/historique-position.component';
import { DisponibiliteAccompagnantComponent } from './disponibilite-accompagnant/disponibilite-accompagnant.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'diagnostic', component: DiagnosticComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'rapport', component: RapportComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
  { path: 'dashboard_diagnostic', component: DashboardDiagnosticComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'statistiques', component: StastiqueDiagnosticComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'profile/patient', component: ProfilePatientComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'profile/soignant', component: ProfileSoignantComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'profile/accompagnant', component: ProfileAccompagnantComponent, canActivate: [authGuard, roleGuard('ACCOMPAGNANT')] },
  { path: 'confirmation', component: ConfirmationComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'map', component: MapComponent },
  { path: 'traitement', component: TraitementComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'historique-positions', component: HistoriquePositionComponent },
  { path: 'disponibilite', component: DisponibiliteAccompagnantComponent, canActivate: [authGuard, roleGuard('ACCOMPAGNANT')] }
];
