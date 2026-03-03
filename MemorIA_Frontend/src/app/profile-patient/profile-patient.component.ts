import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PatientService } from '../services/patient.service';
import { PatientSignupData } from '../models/signup.model';

@Component({
  selector: 'app-profile-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-patient.component.html',
  styleUrl: './profile-patient.component.css'
})
export class ProfilePatientComponent {
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  private readonly fb = inject(FormBuilder);
  private currentUser: { id: number } | null = null;

  form = this.fb.nonNullable.group({
    dateNaissance: ['', [Validators.required]],
    sexe: ['M' as 'M' | 'F' | 'Autre', [Validators.required]],
    numeroSecuriteSociale: ['', [Validators.required]],
    adresse: [''],
    ville: [''],
    groupeSanguin: ['' as '' | 'A_pos' | 'A_neg' | 'B_pos' | 'B_neg' | 'AB_pos' | 'AB_neg' | 'O_pos' | 'O_neg'],
    mutuelle: [''],
    numeroPoliceMutuelle: ['']
  });

  constructor(
    private readonly patientService: PatientService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadExistingProfile();
  }

  onSubmit(): void {
    if (!this.currentUser) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const rawValue = this.form.getRawValue();
    const payload: PatientSignupData = {
      ...rawValue,
      groupeSanguin: rawValue.groupeSanguin || undefined
    };

    this.patientService.saveProfile(this.currentUser.id, payload).subscribe({
      next: () => {
        this.authService.markProfileCompleted();
        this.successMessage = 'Profil patient enregistre.';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/home']), 800);
      },
      error: () => {
        this.errorMessage = 'Impossible de sauvegarder le profil patient.';
        this.isSubmitting = false;
      }
    });
  }

  private loadExistingProfile(): void {
    if (!this.currentUser) {
      return;
    }
    this.patientService.getProfile(this.currentUser.id).subscribe({
      next: (profile: any) => {
        this.form.patchValue({
          dateNaissance: profile?.dateNaissance ?? '',
          sexe: profile?.sexe ?? 'M',
          numeroSecuriteSociale: profile?.numeroSecuriteSociale ?? '',
          adresse: profile?.adresse ?? '',
          ville: profile?.ville ?? '',
          groupeSanguin: profile?.groupeSanguin ?? '',
          mutuelle: profile?.mutuelle ?? '',
          numeroPoliceMutuelle: profile?.numeroPoliceMutuelle ?? ''
        });
      },
      error: () => {
        // No existing profile is expected for first login.
      }
    });
  }
}
