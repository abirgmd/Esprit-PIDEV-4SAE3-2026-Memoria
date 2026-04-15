import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RecMessage {
  id: number;
  recId: number;
  text: string;
  from: 'AIDANT' | 'MEDECIN';
  priority: 'NORMALE' | 'HAUTE';
  sentAt: string;
  read: boolean;
  readBy?: number;
  readAt?: string;
}

export interface CreateRecMessageDto {
  text: string;
  from: 'AIDANT' | 'MEDECIN';
  priority: 'NORMALE' | 'HAUTE';
}

/**
 * Service pour gérer les messages de recommandation
 * Communique avec les endpoints: /api/recommendations/{recId}/messages
 */
@Injectable({
  providedIn: 'root'
})
export class RecMessageService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/recommendations`;

  // BehaviorSubject pour gérer les messages en cache
  private messagesCache = new Map<number, BehaviorSubject<RecMessage[]>>();

  /**
   * Récupère tous les messages d'une recommandation depuis le backend
   */
  getMessagesForRecommendation(recId: number): Observable<RecMessage[]> {
    // Créer un cache pour cette recommandation s'il n'existe pas
    if (!this.messagesCache.has(recId)) {
      this.messagesCache.set(recId, new BehaviorSubject<RecMessage[]>([]));
    }

    return this.http.get<RecMessage[]>(`${this.apiUrl}/${recId}/messages`);
  }

  /**
   * Crée un nouveau message pour une recommandation
   */
  createMessage(recId: number, message: CreateRecMessageDto): Observable<RecMessage> {
    return this.http.post<RecMessage>(`${this.apiUrl}/${recId}/messages`, message);
  }

  /**
   * Marque un message comme lu
   */
  markAsRead(recId: number, messageId: number, readBy: number): Observable<RecMessage> {
    return this.http.patch<RecMessage>(
      `${this.apiUrl}/${recId}/messages/${messageId}/read`,
      {},
      { params: { readBy: readBy.toString() } }
    );
  }

  /**
   * Marque tous les messages d'une recommandation comme lus
   */
  markAllAsRead(recId: number, senderType: 'AIDANT' | 'MEDECIN', readBy: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${recId}/messages/read-all`,
      {},
      { params: { senderType, readBy: readBy.toString() } }
    );
  }

  /**
   * Récupère les messages non lus envoyés par l'aidant
   */
  getUnreadFromAidant(recId: number): Observable<RecMessage[]> {
    return this.http.get<RecMessage[]>(`${this.apiUrl}/${recId}/messages/unread/aidant`);
  }

  /**
   * Récupère les messages non lus envoyés par le médecin
   */
  getUnreadFromMedecin(recId: number): Observable<RecMessage[]> {
    return this.http.get<RecMessage[]>(`${this.apiUrl}/${recId}/messages/unread/medecin`);
  }

  /**
   * Supprime un message
   */
  deleteMessage(recId: number, messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recId}/messages/${messageId}`);
  }

  /**
   * Efface le cache pour une recommandation (utile après modification)
   */
  clearCache(recId: number): void {
    this.messagesCache.delete(recId);
  }

  /**
   * Efface tout le cache
   */
  clearAllCache(): void {
    this.messagesCache.clear();
  }
}
