import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginRequest, LoginResponse, User, UserRole } from '../models/user-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/api/auth';
  
  // Signals for reactive state
  currentUser = signal<User | null>(this.getStoredUser());
  isLoggedIn = signal<boolean>(!!this.getStoredUser());
  userRole = signal<UserRole | null>(this.getStoredRole());

  constructor(private http: HttpClient, private router: Router) {
    // Force clear localStorage on app startup for testing purposes
    // This ensures users always see login page first on fresh start
    this.clearStoredSession();
    this.loadUserFromStorage();
  }

  /**
   * Clear session from localStorage
   */
  private clearStoredSession(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_user_id');
  }

  /**
   * Login with email and password
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  /**
   * Handle successful login
   */
  handleLoginSuccess(response: LoginResponse): void {
    // Store user data
    const userData: User = {
      id: response.id,
      email: response.email,
      nom: response.nom,
      prenom: response.prenom,
      role: response.role,
      adresse: response.adresse,
      actif: true,
      telephone: '',
      profileCompleted: response.profileCompleted
    };

    // Save to localStorage
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_role', response.role);
    localStorage.setItem('auth_user_id', response.id.toString());

    // Update signals
    this.currentUser.set(userData);
    this.isLoggedIn.set(true);
    this.userRole.set(response.role);
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_user_id');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.userRole.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Get current user role
   */
  getUserRole(): UserRole | null {
    return this.userRole();
  }

  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Get user by ID
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}`);
  }

  /**
   * Get all patients
   */
  getAllPatients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/patients`);
  }

  /**
   * Get all soignants
   */
  getAllSoignants(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/soignants`);
  }

  /**
   * Get all aidants
   */
  getAllAidants(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/aidants`);
  }

  /**
   * Get patients for a soignant
   */
  getPatientsForSoignant(soignantId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/soignant/${soignantId}/patients`);
  }

  /**
   * Get aidants for a patient
   */
  getAidantsForPatient(patientId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/patient/${patientId}/aidants`);
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.currentUser.set(storedUser);
      this.isLoggedIn.set(true);
      this.userRole.set(this.getStoredRole());
    }
  }

  /**
   * Get user from localStorage
   */
  private getStoredUser(): User | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Get role from localStorage
   */
  private getStoredRole(): UserRole | null {
    return localStorage.getItem('auth_role') as UserRole | null;
  }
}
