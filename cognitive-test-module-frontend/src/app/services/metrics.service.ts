import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AidantMetrics {
  totalAssigned: number;
  totalCompleted: number;
  successRate: number;
  avgScoreByType: Record<string, number>;
  monthlyCounts: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/metrics`;

  getMetricsForAidant(accompagnantId: number): Observable<AidantMetrics> {
    return this.http.get<AidantMetrics>(`${this.apiUrl}/aidant/${accompagnantId}`);
  }
}
