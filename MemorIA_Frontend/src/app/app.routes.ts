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

// Community & Messenger Components
import { CommunityComponent } from './pages/community/community.component';
import { MessengerComponent } from './pages/messenger/messenger.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { ManagePaymentComponent } from './pages/manage-payment/manage-payment.component';
import { DoctorStatsComponent } from './pages/doctor-stats/doctor-stats.component';
import { ManageSubscriptionsComponent } from './pages/manage-subscriptions/manage-subscriptions.component';
import { subscriptionGuard } from './guards/subscription.guard';
import { PublicationsManageComponent } from './pages/publications-manage/publications-manage.component';
import { PublicationsFeedComponent } from './pages/publications-feed/publications-feed.component';
// Lazy load activities to prevent circular dependencies or premature module crashes
// ActivitiesFeed can be imported directly if needed below, but manage is lazy.



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

  // Community Integration Routes
  { path: 'communaute', component: CommunityComponent, canActivate: [subscriptionGuard] },
  { path: 'messenger', component: MessengerComponent, canActivate: [subscriptionGuard] },
  { path: 'subscribe', component: SubscribeComponent },
  { path: 'manage-payment', component: ManagePaymentComponent },
  { path: 'manage-subscriptions', component: ManageSubscriptionsComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'publications-manage', component: PublicationsManageComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'publications-feed', component: PublicationsFeedComponent },
  { path: 'doctor-stats', component: DoctorStatsComponent, canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'accompagnant-paiement', loadComponent: () => import('./pages/accompagnant-paiement/accompagnant-paiement.component').then(m => m.AccompagnantPaiementComponent), canActivate: [authGuard, roleGuard('ACCOMPAGNANT')] },
  { path: 'activities-manage', loadComponent: () => import('./pages/activities-manage/activities-manage.component').then(m => m.ActivitiesManageComponent), canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'activities-feed', loadComponent: () => import('./pages/activities-feed/activities-feed.component').then(m => m.ActivitiesFeedComponent) },
  { path: 'donation', loadComponent: () => import('./donation/donation.component').then(m => m.DonationComponent) },
  { path: 'donations-list', loadComponent: () => import('./donation/donation-list.component').then(m => m.DonationListComponent), canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'calendrier-doctor', loadComponent: () => import('./features/doctor/calendrier-doctor/calendrier-doctor.component').then(m => m.CalendrierDoctorComponent), canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'reservation-manage', loadComponent: () => import('./features/doctor/reservation-manage/reservation-manage.component').then(m => m.ReservationManageComponent), canActivate: [authGuard, roleGuard('SOIGNANT')] },
  { path: 'calendrier-accompagnant', loadComponent: () => import('./features/accompagnant/calendrier-accompagnant/calendrier-accompagnant.component').then(m => m.CalendrierAccompagnantComponent), canActivate: [authGuard, roleGuard('ACCOMPAGNANT')] },
  { path: 'mes-reservations', loadComponent: () => import('./features/accompagnant/mes-reservations/mes-reservations.component').then(m => m.MesReservationsComponent), canActivate: [authGuard, roleGuard('ACCOMPAGNANT')] },


];
