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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'diagnostic', component: DiagnosticComponent },
  { path: 'rapport', component: RapportComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
  { path: 'profile/patient', component: ProfilePatientComponent, canActivate: [authGuard, roleGuard('PATIENT')] },
  { path: 'profile/soignant', component: ProfileSoignantComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'profile/accompagnant', component: ProfileAccompagnantComponent, canActivate: [authGuard, roleGuard('ACCOMPAGNANT')] }
];
