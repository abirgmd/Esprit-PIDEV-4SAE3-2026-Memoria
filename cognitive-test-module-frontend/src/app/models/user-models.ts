export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'PATIENT' | 'SOIGNANT' | 'AIDANT';
  actif: boolean;
  adresse: string;
  dateNaissance?: string;
  sexe?: string;
  specialite?: string;
  matricule?: string;
  relation?: string;
  profileCompleted: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'PATIENT' | 'SOIGNANT' | 'AIDANT';
  adresse: string;
  profileCompleted: boolean;
  message: string;
}

export type UserRole = 'PATIENT' | 'SOIGNANT' | 'AIDANT';
