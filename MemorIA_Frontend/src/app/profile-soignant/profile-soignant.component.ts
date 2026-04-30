import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SoignantService } from '../services/soignant.service';
import { SoignantSignupData } from '../models/signup.model';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'app-profile-soignant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Toast, ButtonModule, InputText, Textarea, InputNumber, IconField, InputIcon],
  providers: [MessageService],
  templateUrl: './profile-soignant.component.html',
  styleUrl: './profile-soignant.component.css'
})
export class ProfileSoignantComponent {
  isSubmitting = false;
  private readonly fb = inject(FormBuilder);
  private currentUser: any = null;

  form = this.fb.nonNullable.group({
    numeroOrdre: ['', [Validators.required]],
    specialite: ['', [Validators.required]],
    hopital: ['', [Validators.required]],
    numeroTelephone2: [''],
    diplomes: [''],
    anneesExperience: [0],
    biographie: [''],
    dateDebutExercice: ['']
  });

  constructor(
    private readonly soignantService: SoignantService,
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
      : 'Soignant';
  }

  onSubmit(): void {
    if (!this.currentUser) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const rawValue = this.form.getRawValue();
    const payload: SoignantSignupData = {
      ...rawValue,
      anneesExperience: rawValue.anneesExperience || undefined,
      dateDebutExercice: rawValue.dateDebutExercice || undefined
    };

    this.soignantService.saveProfile(this.currentUser.id, payload).subscribe({
      next: () => {
        this.authService.markProfileCompleted();
        this.messageService.add({ severity: 'success', summary: 'Profil enregistré', detail: 'Redirection vers votre tableau de bord…' });
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/dashboard_diagnostic']), 1200);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de sauvegarder le profil.' });
        this.isSubmitting = false;
      }
    });
  }

  private loadExistingProfile(): void {
    if (!this.currentUser) return;
    this.soignantService.getProfile(this.currentUser.id).subscribe({
      next: (profile: any) => {
        this.form.patchValue({
          numeroOrdre: profile?.numeroOrdre ?? '',
          specialite: profile?.specialite ?? '',
          hopital: profile?.hopital ?? '',
          numeroTelephone2: profile?.numeroTelephone2 ?? '',
          diplomes: profile?.diplomes ?? '',
          anneesExperience: profile?.anneesExperience ?? 0,
          biographie: profile?.biographie ?? '',
          dateDebutExercice: profile?.dateDebutExercice ?? ''
        });
      },
      error: () => {}
    });
  }
}
