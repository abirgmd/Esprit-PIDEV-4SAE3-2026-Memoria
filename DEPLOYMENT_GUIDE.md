# Plan d'Implémentation - Migration vers Authentification Unifiée

## 📋 Résumé des Changements

Ce projet a été migré d'un système de gestion d'utilisateurs multiples (Patient, Soignant, Accompagnant) vers une **architecture unifiée avec une seule entité `User`** et un **système d'authentification par email/mot de passe**.

### Points Clés:
- ✅ **Une seule table `users`** (remplace `patients`, `soignants`, `accompagnants`)
- ✅ **Authentification email/password** (remplace la sélection de rôle)
- ✅ **Maintien des données existantes** via script de migration
- ✅ **Routage automatique par rôle** après login
- ✅ **Interface de login professionnelle**

---

## 🚀 Steps d'Implémentation

### Phase 1: Préparation (Production)

#### 1.1 Backup de la Base de Données
```bash
# Créer une sauvegarde complète avant migration
mysqldump -u root -p memoria > memoria_backup_$(date +%Y%m%d).sql
```

#### 1.2 Vérifier l'Application Backend
```bash
cd cognitive-test-module-beckend
mvn clean install
```

#### 1.3 Vérifier l'Application Frontend
```bash
cd cognitive-test-module-frontend
npm install
ng build
```

---

### Phase 2: Déploiement Backend

#### 2.1 Arrêter l'Application Existante
```powershell
# Windows PowerShell
Get-Process java | Stop-Process -Force

# Ou utiliser le script fourni
.\start-backend.ps1  # (avec arrêt)
```

#### 2.2 Appliquer les Changements de Code
Les fichiers suivants ont été **créés/modifiés**:

**Nouvelles entités:**
- `src/main/java/com/med/cognitive/entity/User.java` - Entité unifiée

**Nouveaux DTOs:**
- `src/main/java/com/med/cognitive/dto/UserDTO.java`
- `src/main/java/com/med/cognitive/dto/LoginRequest.java`
- `src/main/java/com/med/cognitive/dto/LoginResponse.java`

**Nouveaux services:**
- `src/main/java/com/med/cognitive/service/AuthService.java`

**Nouveaux controlleurs:**
- `src/main/java/com/med/cognitive/controller/AuthController.java`
- GET `/api/auth/user/{id}` - Récupérer utilisateur
- GET `/api/auth/patients` - Lister tous les patients
- GET `/api/auth/soignants` - Lister tous les médecins
- GET `/api/auth/aidants` - Lister tous les aidants
- GET `/api/auth/soignant/{soignantId}/patients` - Patients d'un médecin
- GET `/api/auth/patient/{patientId}/aidants` - Aidants d'un patient
- **POST `/api/auth/login`** - Connexion utilisateur

**Nouveau repository:**
- `src/main/java/com/med/cognitive/repository/UserRepository.java`

#### 2.3 Exécuter le Script de Migration
```bash
# Dans MySQL/MariaDB CLI
cd src/main/resources/
mysql -u root -p memoria < migration_data.sql

# OU via workbench :
# 1. Ouvrir MySQL Workbench
# 2. Fichier → Ouvrir fichier SQL → migration_data.sql
# 3. Exécuter (Ctrl+Shift+Enter)
```

**Vérifier la migration:**
```sql
SELECT COUNT(*) as total_users, role FROM users GROUP BY role;
```

Résultat attendu:
```
total_users | role
5           | PATIENT
2           | SOIGNANT
3           | AIDANT
```

#### 2.4 Démarrer l'Application Backend
```powershell
cd cognitive-test-module-beckend
.\start-backend.ps1
# Ou: mvn spring-boot:run
```

Vérifier que l'API est accessible:
```bash
curl http://localhost:8080/api/auth/soignants
# Devrait retourner une liste JSON
```

---

### Phase 3: Déploiement Frontend

#### 3.1 Mettre à jour les Dépendances
```bash
cd cognitive-test-module-frontend
npm install --save-dev @angular/common
```

#### 3.2 Vérifier les Nouveaux Fichiers Créés

**Services:**
- `src/app/services/auth.service.ts` - Service d'authentification
- `src/app/services/auth.guard.ts` - Guard de route

**Composants:**
- `src/app/pages/login/login.component.ts` - Interface de login
- `src/app/pages/login/login.component.html`
- `src/app/pages/login/login.component.css`
- `src/app/components/logout-btn/logout-btn.component.ts` - Bouton déconnexion

**Modèles:**
- `src/app/models/user-models.ts` - Interfaces TypeScript

**Routes:**
- `src/app/app.routes.ts` - MISE À JOUR avec `/login` + guards

#### 3.3 Compiler et Tester
```bash
ng serve
# Accédez à http://localhost:4200/login
```

#### 3.4 Déployer en Production
```bash
ng build --configuration production
# Les fichiers seront dans dist/
```

---

## 🔐 Utilisation du Système d'Authentification

### Données de Test Incluses

| Rôle       | Email                     | Mot de passe   | Fonction |
|-----------|---------------------------|----------------|----------|
| SOIGNANT  | `jeandupont@memoria.com` | `Med123!Pass` | Médecin |
| SOIGNANT  | `mariemartin@memoria.com` | `Doc456!Pass` | Médecin |
| PATIENT   | `claudelefevre@memoria.com` | `Pat123!Pass` | Patient |
| PATIENT   | `jeanninmoreau@memoria.com` | `Pat456!Pass` | Patient |
| PATIENT   | `robertrenard@memoria.com` | `Pat789!Pass` | Patient |
| AIDANT    | `pierredupont@memoria.com` | `Aid123!Pass` | Accompagnant |
| AIDANT    | `sophiemartin@memoria.com` | `Aid456!Pass` | Accompagnant |
| AIDANT    | `luclefevre@memoria.com` | `Aid789!Pass` | Accompagnant |

### Flux de Connexion
```
1. Accéder à http://localhost:4200
2. Être redirigé automatiquement à /login (si pas connecté)
3. Entrer email + mot de passe
4. API /auth/login valide les credentials
5. Si valide:
   - Stocker user dans localStorage
   - Router selon le rôle:
     * SOIGNANT → /medecin-metrics
     * AIDANT → /aidant-metrics?aidantId=X
     * PATIENT → /tests-cognitifs
```

---

## 📝 Modifications par Composant

### Backend API Endpoints - NOUVEAUX

```bash
# Login
POST /api/auth/login
{
  "email": "medecin@memoria.com",
  "password": "Med123!Pass"
}
Response: {
  "id": 1,
  "email": "medecin@memoria.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "SOIGNANT",
  "adresse": "123 Rue...",
  "profileCompleted": false,
  "message": "Login successful"
}

# Get User
GET /api/auth/user/1

# Get All Users by Role
GET /api/auth/soignants
GET /api/auth/patients
GET /api/auth/aidants

# Get Relationships
GET /api/auth/soignant/1/patients
GET /api/auth/patient/1/aidants
```

### Frontend Routes - MISES À JOUR

```typescript
// Avant: Pas de login requis
GET / → LayoutComponent

// Après: Login requis
GET /login → LoginComponent (public)
GET / → AuthGuard ✓ → LayoutComponent

// Routes protégées (nécessitent AuthGuard):
/tests-cognitifs
/medecin-metrics
/aidant-metrics?aidantId=X
/gestion-tests
... (toutes les routes sauf /login)
```

### Stockage Client (localStorage)

```javascript
// Avant: Rôle + ID séparés
localStorage.getItem('memoria_user_role')    // 'SOIGNANT'
localStorage.getItem('memoria_user_id')      // '1'

// Après: User complet + role + id
localStorage.getItem('auth_user')            // {"id":1, "nom":"Dupont", ...}
localStorage.getItem('auth_role')            // 'SOIGNANT'
localStorage.getItem('auth_user_id')         // '1'
```

---

## ⚙️ Configuration Système

### Environment Backend
- URL API: `http://localhost:8080`
- Port: `8080`
- Database: `memoria`
- Driver: `com.mysql.cj.jdbc.Driver`

### Environment Frontend
```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:8080/api',
  production: false
};

// Voir src/app/services/auth.service.ts ligne ~13
private apiUrl = 'http://localhost:8080/api/auth';
```

---

## 🐛 Dépannage

### Problème: "Invalid email or password"
**Cause:** Email ou mot de passe incorrect
**Solution:** Vérifier les credentials dans la table `users`

### Problème: CORS error lors du login
**Cause:** Backend n'autorise pas les requêtes du frontend
**Solution:** Vérifier `@CrossOrigin(origins = "*")` dans AuthController

### Problème: Utilisateur redirigé à /login après chaque changement de page
**Cause:** Le guard AuthGuard n'est pas correctement configuré
**Solution:** Vérifier que `AuthService.isAuthenticated()` fonctionne

### Problème: "Cannot find module '@angular/common'"
**Solution:** `npm install @angular/common`

---

## 🔄 Rollback Plan

Si problème lors du déploiement:

```bash
# 1. Restaurer la base de données
mysql -u root -p memoria < memoria_backup_YYYYMMDD.sql

# 2. Restaurer le code précédent depuis Git
git checkout HEAD~1

# 3. Redémarrer l'application
cd cognitive-test-module-beckend
mvn clean spring-boot:run
```

---

## 📊 Vérification Post-Déploiement

### Checklist:
- [ ] Application démarre sans erreurs
- [ ] Table `users` créée avec toutes les colonnes
- [ ] Données migrées correctement (vérifier COUNT par rôle)
- [ ] Données de test insérées
- [ ] Frontend compile sans erreurs
- [ ] Page de login accessible
- [ ] Login avec `medecin@memoria.com` fonctionne
- [ ] Redirection automatique selon rôle fonctionne
- [ ] Bouton logout fonctionne
- [ ] localStorage mis à jour après login
- [ ] Toutes les routes protégées par AuthGuard
- [ ] Accès à `/test-cognitifs` va à `/login` si pas connecté

---

## 📞 Support & Documentation

- **Guide Utilisateurs:** `GUIDE_UTILISATEURS.md`
- **Script Migration:** `src/main/resources/migration_data.sql`
- **Points de Contact:**
  - Backend: `AuthService`, `AuthController`
  - Frontend: `AuthService`, `LoginComponent`
  - Database: Vérifier migrations après startup

---

**Version:** 1.0  
**Date:** Avril 2026  
**Status:** Prêt pour déploiement

