import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DossierMedical } from '../models/dossier-medical.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DossierMedicalService {
  private readonly apiUrl = `${environment.apiUrl}/api/dossiers-medicaux`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const userId = this.authService.getCurrentUser()?.id;
    return new HttpHeaders({ 'X-Requester-Id': String(userId ?? '') });
  }

  getAll(): Observable<DossierMedical[]> {
    return this.http.get<DossierMedical[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getByPatientId(patientId: number): Observable<DossierMedical> {
    return this.http.get<DossierMedical>(`${this.apiUrl}/patient/${patientId}`, { headers: this.getHeaders() });
  }

  create(dossier: DossierMedical): Observable<DossierMedical> {
    return this.http.post<DossierMedical>(this.apiUrl, dossier, { headers: this.getHeaders() });
  }

  update(id: number, dossier: DossierMedical): Observable<DossierMedical> {
    return this.http.put<DossierMedical>(`${this.apiUrl}/${id}`, dossier, { headers: this.getHeaders() });
  }

  updateNotes(id: number, notesMedecin: string): Observable<DossierMedical> {
    return this.http.patch<DossierMedical>(
      `${this.apiUrl}/${id}/notes`,
      { notesMedecin },
      { headers: this.getHeaders() }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
