import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccompagnantSignupData } from '../models/signup.model';
import { environment } from '../../environments/environment';

export interface AccompagnantSummary {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccompagnantService {
  private readonly apiUrl = `${environment.apiUrl}/api/accompagnants`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<AccompagnantSummary[]> {
    return this.http.get<AccompagnantSummary[]>(this.apiUrl);
  }

  getProfile(userId: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/profile/${userId}`);
  }

  saveProfile(userId: number, payload: AccompagnantSignupData): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/profile/${userId}`, payload);
  }
}
