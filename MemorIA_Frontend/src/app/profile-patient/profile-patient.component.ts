import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PatientService } from '../services/patient.service';
import { PatientSignupData } from '../models/signup.model';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'app-profile-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Toast, ButtonModule, InputText, Select, IconField, InputIcon],
  providers: [MessageService],
  templateUrl: './profile-patient.component.html',
  styleUrl: './profile-patient.component.css'
})
export class ProfilePatientComponent {
  isSubmitting = false;
  private readonly fb = inject(FormBuilder);
  private currentUser: any = null;

  sexeOptions = [
    { label: 'Masculin', value: 'M' },
    { label: 'Féminin', value: 'F' },
    { label: 'Autre', value: 'Autre' }
  ];

  groupeSanguinOptions = [
    { label: 'Non précisé', value: '' },
    { label: 'A+', value: 'A_pos' }, { label: 'A-', value: 'A_neg' },
    { label: 'B+', value: 'B_pos' }, { label: 'B-', value: 'B_neg' },
    { label: 'AB+', value: 'AB_pos' }, { label: 'AB-', value: 'AB_neg' },
    { label: 'O+', value: 'O_pos' }, { label: 'O-', value: 'O_neg' }
  ];

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
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadExistingProfile();
  }

  get userName(): string {
    return this.currentUser?.prenom
      ? `${this.currentUser.prenom} ${this.currentUser.nom ?? ''}`.trim()
      : 'Patient';
  }

  onSubmit(): void {
    if (!this.currentUser) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const rawValue = this.form.getRawValue();
    const payload: PatientSignupData = { ...rawValue, groupeSanguin: rawValue.groupeSanguin || undefined };

    this.patientService.saveProfile(this.currentUser.id, payload).subscribe({
      next: () => {
        this.authService.markProfileCompleted();
        this.messageService.add({ severity: 'success', summary: 'Profil enregistré', detail: 'Redirection vers votre espace…' });
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/diagnostic']), 1200);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de sauvegarder le profil.' });
        this.isSubmitting = false;
      }
    });
  }

  private loadExistingProfile(): void {
    if (!this.currentUser) return;
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
      error: () => {}
    });
  }
}
