import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Search, Filter, UserPlus, TrendingDown, TrendingUp, Clock } from 'lucide-angular';
import { AssignationService } from '../../services/assignation.service';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string;
  sexe: string;
  adresse: string;
  medecin?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    specialite: string;
  };
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  private assignationService = inject(AssignationService);
  
  readonly icons = {
    Search,
    Filter,
    UserPlus,
    TrendingDown,
    TrendingUp,
    Clock
  };

  patients = signal<Patient[]>([]);
  filteredPatients = signal<Patient[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.isLoading.set(true);
    this.assignationService.getAllPatientsWithMedecin().subscribe({
      next: (patients: Patient[]) => {
        this.patients.set(patients);
        this.filteredPatients.set(patients);
        this.isLoading.set(false);
        console.log('Patients chargés:', patients);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des patients:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(event: any) {
    const query = event.target.value;
    this.searchQuery.set(query);
    
    if (query.trim() === '') {
      this.filteredPatients.set(this.patients());
    } else {
      this.assignationService.searchPatients(query).subscribe({
        next: (searchResults: Patient[]) => {
          this.filteredPatients.set(searchResults);
        },
        error: (err) => {
          console.error('Erreur lors de la recherche:', err);
          // Fallback: filter local data
          const filtered = this.patients().filter(patient => 
            patient.nom.toLowerCase().includes(query.toLowerCase()) ||
            patient.prenom.toLowerCase().includes(query.toLowerCase())
          );
          this.filteredPatients.set(filtered);
        }
      });
    }
  }

  getAge(dateNaissance: string): number {
    const birth = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getInitials(prenom: string, nom: string): string {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }

  getMedecinFullName(medecin?: any): string {
    if (!medecin) return 'Non assigné';
    return `Dr. ${medecin.prenom} ${medecin.nom}`;
  }

  getMedecinSpecialite(medecin?: any): string {
    if (!medecin) return '';
    return medecin.specialite || '';
  }
}
