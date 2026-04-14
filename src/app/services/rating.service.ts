import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8081/ratings'; // Matching backend port

  constructor(private http: HttpClient) { }

  ratePublication(pubId: number, userId: number, value: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pub/${pubId}`, { userId, value });
  }

  getPubRatingStats(pubId: number, userId?: number): Observable<any> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get(`${this.apiUrl}/pub/${pubId}/stats`, { params });
  }
}
