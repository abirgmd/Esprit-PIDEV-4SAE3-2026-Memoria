import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { DossierMedicalService } from '../services/dossier-medical.service';
import {
  DossierMedical,
  StadeMaladie,
  Orientation,
  NiveauFonctionnement,
  EtatComportement
} from '../models/dossier-medical.model';

interface DossierForm {
  patientId: number | null;
  contactPatient: string;
  typeDiagnostic: string;
  stade: StadeMaladie | '';
  dateDiagnostic: string;
  maladiesPrincipales: string;
  allergies: string;
  niveauMemoire: string;
  orientation: Orientation | '';
  niveauFonctionnement: NiveauFonctionnement | '';
  medicamentsActuels: string;
  etatComportement: EtatComportement | '';
  accompagnantNom: string;
  accompagnantContact: string;
  notesMedecin: string;
  derniereVisite: string;
}

@Component({
  selector: 'app-dossier-medical',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dossier-medical.component.html',
  styleUrl: './dossier-medical.component.css'
})
export class DossierMedicalComponent implements OnInit {
  userRole: string | null = null;
  currentUserId: number | null = null;

  dossiers: DossierMedical[] = [];
  loadingList = false;
  listError = '';

  selectedDossier: DossierMedical | null = null;
  loadingDossier = false;
  dossierError = '';

  showForm = false;
  isEditing = false;
  isSaving = false;
  saveMessage = '';
  saveSuccess = false;

  searchQuery = '';

  formData: DossierForm = this.emptyForm();

  stadeOptions: { label: string; value: StadeMaladie }[] = [
    { label: 'Léger', value: 'LEGER' },
    { label: 'Modéré', value: 'MODERE' },
    { label: 'Sévère', value: 'SEVERE' }
  ];

  orientationOptions: { label: string; value: Orientation }[] = [
    { label: 'Conscient', value: 'CONSCIENT' },
    { label: 'Confus', value: 'CONFUS' }
  ];

  fonctionnementOptions: { label: string; value: NiveauFonctionnement }[] = [
    { label: 'Indépendant', value: 'INDEPENDANT' },
    { label: "Besoin d'aide", value: 'BESOIN_AIDE' },
    { label: 'Dépendant', value: 'DEPENDANT' }
  ];

  comportementOptions: { label: string; value: EtatComportement }[] = [
    { label: 'Calme', value: 'CALME' },
    { label: 'Anxieux', value: 'ANXIEUX' },
    { label: 'Agressif', value: 'AGRESSIF' },
    { label: 'Fugue', value: 'FUGUE' }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly dossierService: DossierMedicalService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role ?? null;
    this.currentUserId = user?.id ?? null;

    if (this.isSoignantOrAdmin) {
      this.loadAllDossiers();
    } else if (this.userRole === 'PATIENT') {
      this.loadPatientDossier();
    }
  }

  get isSoignantOrAdmin(): boolean {
    return this.userRole === 'SOIGNANT' || this.userRole === 'ADMINISTRATEUR';
  }

  get filteredDossiers(): DossierMedical[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.dossiers;
    return this.dossiers.filter(d =>
      String(d.patient.id).includes(q) ||
      (d.typeDiagnostic ?? '').toLowerCase().includes(q) ||
      (d.accompagnantNom ?? '').toLowerCase().includes(q)
    );
  }

  loadAllDossiers(): void {
    this.loadingList = true;
    this.listError = '';
    this.dossierService.getAll().subscribe({
      next: (data) => {
        this.dossiers = data;
        this.loadingList = false;
      },
      error: () => {
        this.listError = 'Impossible de charger les dossiers médicaux.';
        this.loadingList = false;
      }
    });
  }

  loadPatientDossier(): void {
    if (!this.currentUserId) return;
    this.loadingDossier = true;
    this.dossierError = '';
    this.dossierService.getByPatientId(this.currentUserId).subscribe({
      next: (dossier) => {
        this.selectedDossier = dossier;
        this.loadingDossier = false;
      },
      error: (err) => {
        this.dossierError = err.status === 404
          ? 'Aucun dossier médical trouvé. Contactez votre soignant pour qu\'il crée votre dossier.'
          : 'Impossible de charger votre dossier médical.';
        this.loadingDossier = false;
      }
    });
  }

  selectDossier(dossier: DossierMedical): void {
    this.selectedDossier = dossier;
    this.showForm = false;
    this.saveMessage = '';
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.formData = this.emptyForm();
    this.showForm = true;
    this.saveMessage = '';
  }

  openEditForm(): void {
    if (!this.selectedDossier) return;
    this.isEditing = true;
    const d = this.selectedDossier;
    this.formData = {
      patientId: d.patient.id,
      contactPatient: d.contactPatient ?? '',
      typeDiagnostic: d.typeDiagnostic ?? '',
      stade: d.stade ?? '',
      dateDiagnostic: d.dateDiagnostic ?? '',
      maladiesPrincipales: d.maladiesPrincipales ?? '',
      allergies: d.allergies ?? '',
      niveauMemoire: d.niveauMemoire ?? '',
      orientation: d.orientation ?? '',
      niveauFonctionnement: d.niveauFonctionnement ?? '',
      medicamentsActuels: d.medicamentsActuels ?? '',
      etatComportement: d.etatComportement ?? '',
      accompagnantNom: d.accompagnantNom ?? '',
      accompagnantContact: d.accompagnantContact ?? '',
      notesMedecin: d.notesMedecin ?? '',
      derniereVisite: d.derniereVisite ?? ''
    };
    this.showForm = true;
    this.saveMessage = '';
  }

  cancelForm(): void {
    this.showForm = false;
    this.saveMessage = '';
  }

  saveDossier(): void {
    if (!this.formData.patientId) {
      this.saveMessage = 'L\'identifiant du patient est requis.';
      this.saveSuccess = false;
      return;
    }

    this.isSaving = true;
    this.saveMessage = '';

    const payload: DossierMedical = {
      patient: { id: this.formData.patientId },
      contactPatient: this.formData.contactPatient || undefined,
      typeDiagnostic: this.formData.typeDiagnostic || undefined,
      stade: (this.formData.stade as StadeMaladie) || undefined,
      dateDiagnostic: this.formData.dateDiagnostic || undefined,
      maladiesPrincipales: this.formData.maladiesPrincipales || undefined,
      allergies: this.formData.allergies || undefined,
      niveauMemoire: this.formData.niveauMemoire || undefined,
      orientation: (this.formData.orientation as Orientation) || undefined,
      niveauFonctionnement: (this.formData.niveauFonctionnement as NiveauFonctionnement) || undefined,
      medicamentsActuels: this.formData.medicamentsActuels || undefined,
      etatComportement: (this.formData.etatComportement as EtatComportement) || undefined,
      accompagnantNom: this.formData.accompagnantNom || undefined,
      accompagnantContact: this.formData.accompagnantContact || undefined,
      notesMedecin: this.formData.notesMedecin || undefined,
      derniereVisite: this.formData.derniereVisite || undefined
    };

    if (this.isEditing && this.selectedDossier?.id) {
      this.dossierService.update(this.selectedDossier.id, payload).subscribe({
        next: (updated) => {
          this.selectedDossier = updated;
          this.isSaving = false;
          this.saveMessage = 'Dossier mis à jour avec succès !';
          this.saveSuccess = true;
          this.loadAllDossiers();
          setTimeout(() => this.cancelForm(), 1500);
        },
        error: () => {
          this.isSaving = false;
          this.saveMessage = 'Erreur lors de la mise à jour du dossier.';
          this.saveSuccess = false;
        }
      });
    } else {
      this.dossierService.create(payload).subscribe({
        next: (created) => {
          this.selectedDossier = created;
          this.isSaving = false;
          this.saveMessage = 'Dossier créé avec succès !';
          this.saveSuccess = true;
          this.loadAllDossiers();
          setTimeout(() => this.cancelForm(), 1500);
        },
        error: (err) => {
          this.isSaving = false;
          this.saveSuccess = false;
          if (err.status === 409) {
            this.saveMessage = 'Un dossier existe déjà pour ce patient. Utilisez la modification.';
          } else if (err.status === 404) {
            this.saveMessage = 'Patient introuvable avec cet identifiant.';
          } else if (err.status === 403) {
            this.saveMessage = 'Accès refusé.';
          } else {
            this.saveMessage = 'Erreur lors de la création du dossier.';
          }
        }
      });
    }
  }

  deleteDossier(dossier: DossierMedical): void {
    if (!dossier.id) return;
    if (!confirm(`Supprimer le dossier médical du patient #${dossier.patient.id} ? Cette action est irréversible.`)) return;
    this.dossierService.delete(dossier.id).subscribe({
      next: () => {
        if (this.selectedDossier?.id === dossier.id) {
          this.selectedDossier = null;
        }
        this.loadAllDossiers();
      },
      error: () => {}
    });
  }

  getStadeLabel(stade?: string): string {
    const map: Record<string, string> = { LEGER: 'Léger', MODERE: 'Modéré', SEVERE: 'Sévère' };
    return map[stade ?? ''] ?? stade ?? '-';
  }

  getStadeClass(stade?: string): string {
    const map: Record<string, string> = { LEGER: 'badge-green', MODERE: 'badge-amber', SEVERE: 'badge-red' };
    return map[stade ?? ''] ?? 'badge-gray';
  }

  getOrientationLabel(o?: string): string {
    const map: Record<string, string> = { CONSCIENT: 'Conscient', CONFUS: 'Confus' };
    return map[o ?? ''] ?? o ?? '-';
  }

  getFonctionnementLabel(n?: string): string {
    const map: Record<string, string> = { INDEPENDANT: 'Indépendant', BESOIN_AIDE: "Besoin d'aide", DEPENDANT: 'Dépendant' };
    return map[n ?? ''] ?? n ?? '-';
  }

  getComportementLabel(e?: string): string {
    const map: Record<string, string> = { CALME: 'Calme', ANXIEUX: 'Anxieux', AGRESSIF: 'Agressif', FUGUE: 'Fugue' };
    return map[e ?? ''] ?? e ?? '-';
  }

  getComportementClass(e?: string): string {
    const map: Record<string, string> = { CALME: 'badge-green', ANXIEUX: 'badge-amber', AGRESSIF: 'badge-red', FUGUE: 'badge-purple' };
    return map[e ?? ''] ?? 'badge-gray';
  }

  private emptyForm(): DossierForm {
    return {
      patientId: null,
      contactPatient: '',
      typeDiagnostic: '',
      stade: '',
      dateDiagnostic: '',
      maladiesPrincipales: '',
      allergies: '',
      niveauMemoire: '',
      orientation: '',
      niveauFonctionnement: '',
      medicamentsActuels: '',
      etatComportement: '',
      accompagnantNom: '',
      accompagnantContact: '',
      notesMedecin: '',
      derniereVisite: ''
    };
  }
}
