import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private api = `${environment.communityApiUrl}/stats`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<any> {
        return this.http.get<any>(this.api);
    }

    getUserStats(userId: number): Observable<any> {
        return this.http.get<any>(`${this.api}/user/${userId}`);
    }

    getActivityChart(): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/activity`);
    }
}
