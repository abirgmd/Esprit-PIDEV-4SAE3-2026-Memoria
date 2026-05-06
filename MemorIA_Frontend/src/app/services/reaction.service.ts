import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service de réaction dont l'URL a été ré-orientée vers /comments/reactions 
 * pour profiter du mappage Gateway/Port qui est déjà fonctionnel.
 */
@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  // On utilise le préfixe /comments/reactions car on sait que /comments est déjà ouvert sur le port 8081
  private apiUrl = 'http://localhost:8081/comments/reactions';

  constructor(private http: HttpClient) {}

  /**
   * Ajoute ou retire une réaction sur une publication.
   */
  reactToPublication(pubId: number, userId: number, type: string): Observable<any> {
    const body = { userId, type };
    return this.http.post(`${this.apiUrl}/pub/${pubId}`, body);
  }

  /**
   * Ajoute ou retire une réaction sur un commentaire.
   */
  reactToComment(commentId: number, userId: number, type: string): Observable<any> {
    const body = { userId, type };
    return this.http.post(`${this.apiUrl}/comment/${commentId}`, body);
  }

  getPubCount(pubId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/pub/${pubId}/count`);
  }

  getCommentCount(commentId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/comment/${commentId}/count`);
  }

  getUserPubReaction(pubId: number, userId: number): Observable<{ reaction: string }> {
    return this.http.get<{ reaction: string }>(`${this.apiUrl}/pub/${pubId}/user/${userId}`);
  }

  getUserCommentReaction(commentId: number, userId: number): Observable<{ reaction: string }> {
    return this.http.get<{ reaction: string }>(`${this.apiUrl}/comment/${commentId}/user/${userId}`);
  }
}
