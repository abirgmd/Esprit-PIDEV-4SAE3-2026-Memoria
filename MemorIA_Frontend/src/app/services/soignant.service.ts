import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SoignantSignupData } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class SoignantService {
  private readonly apiUrl = 'http://localhost:8087/api/soignants';

  constructor(private readonly http: HttpClient) {}

  getProfile(userId: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/profile/${userId}`);
  }

  saveProfile(userId: number, payload: SoignantSignupData): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/profile/${userId}`, payload);
  }
}
