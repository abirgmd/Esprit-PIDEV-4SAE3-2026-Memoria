import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Donation {
  id?: number;
  amount: number;
  currency: string;
  dedicated: boolean;
  honoreeName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  receiveEmail: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:8085/api/donations';

  constructor(private http: HttpClient) { }

  createDonation(donation: Donation): Observable<Donation> {
    return this.http.post<Donation>(this.apiUrl, donation);
  }

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.apiUrl}?t=${new Date().getTime()}`);
  }
}
