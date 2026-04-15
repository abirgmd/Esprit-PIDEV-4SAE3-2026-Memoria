# Guide MemoriA - Accès par Rôle

## 📋 Données de Test Prédéfinies

### Connexion

Tous les utilisateurs se connectent via l'écran de login avec:
- **Email**: L'adresse email de l'utilisateur
- **Mot de passe**: Le mot de passe assigné

---

## 👥 Utilisateurs par Rôle

### 1. 👨‍⚕️ SOIGNANT (Médecin)

| Email | Mot de passe | Nom | Prénom | Spécialité | Accès |
|-------|--------------|-----|--------|-----------|-------|
| `jeandupont@memoria.com` | `Med123!Pass` | Dupont | Jean | Neurologie | Dashboard médecin, Gestion tests, Patients |
| `mariemartin@memoria.com` | `Doc456!Pass` | Martin | Marie | Gériatrie | Dashboard médecin, Gestion tests, Patients |

**Accès après login:**
- ✅ Dashboard personnel (vue médecin)
- ✅ Gestion des tests cognitifs
- ✅ Vue de tous les patients assignés
- ✅ Métriques de cohorte
- ✅ Assignation de tests aux patients
- ✅ Recommandations personnalisées

---

### 2. 👵 PATIENT

| Email | Mot de passe | Nom | Prénom | Date Naissance | Adresse | Médecin assigné |
|-------|--------------|-----|--------|---|---------|---------|
| `claudelefevre@memoria.com` | `Pat123!Pass` | Lefevre | Claude | 1948-05-15 | 42 Rue de Lyon, Paris | jeandupont@memoria.com |
| `jeanninmoreau@memoria.com` | `Pat456!Pass` | Moreau | Jeannine | 1952-03-22 | 15 Avenue des Champs, Lyon | mariemartin@memoria.com |
| `robertrenard@memoria.com` | `Pat789!Pass` | Renard | Robert | 1945-11-10 | 8 Boulevard Victor, Marseille | jeandupont@memoria.com |

**Accès après login:**
- ✅ Page d'accueil (Tests Cognitifs)
- ✅ Passer les tests assignés
- ✅ Voir ses résultats personnels
- ✅ Historique des tests

---

### 3. 🤝 AIDANT (Accompagnant/Caregiver)

| Email | Mot de passe | Nom | Prénom | Relation | Patient assigné | Accès |
|-------|--------------|-----|--------|----------|---------|--------|
| `pierredupont@memoria.com` | `Aid123!Pass` | Dupont | Pierre | FILS | claudelefevre@memoria.com | Dashboard, Planning |
| `sophiemartin@memoria.com` | `Aid456!Pass` | Martin | Sophie | EPOUSE | jeanninmoreau@memoria.com | Dashboard, Planning |
| `luclefevre@memoria.com` | `Aid789!Pass` | Lefevre | Luc | FILS | robertrenard@memoria.com | Dashboard, Planning |

**Accès après login:**
- ✅ Dashboard aidant personnel
- ✅ Voir les tests assignés au patient
- ✅ Voir le statut des tests
- ✅ Accéder au planning
- ✅ Voir les métriques du patient suivi

---

## 🔐 Flux de Connexion

```
1. Utilisateur accède à "test-cognitifs"
   ↓
2. Redirigé vers écran de LOGIN (si pas connecté)
   ↓
3. Entre email + mot de passe
   ↓
4. Système vérifie les credentials
   ↓
5. Si valide → Déterminer le rôle
   ├─ SOIGNANT → Dashboard Médecin
   ├─ PATIENT → Tests Cognitifs
   └─ AIDANT → Dashboard Aidant

6. Page sélectionnée selon le rôle
```

---

## 🔗 Routes Accessibles par Rôle

| Route | SOIGNANT | PATIENT | AIDANT |
|-------|----------|---------|--------|
| `/login` | ✅ | ✅ | ✅ |
| `/tests-cognitifs` | ✅ | ✅ | ✅ |
| `/gestion-tests` | ✅ | ❌ | ❌ |
| `/medecin-metrics` | ✅ | ❌ | ❌ |
| `/aidant-metrics?aidantId=X` | ❌ | ❌ | ✅ |
| `/patient-detail/:id` | ✅ | ✅ | ❌ |

---

## 🆕 Changements par rapport à l'Ancien Système

| Ancien | Nouveau |
|--------|---------|
| Sélection du rôle par dropdown | ❌ Plus de sélection - **Login automatique** |
| Tables séparées (patients, soignants, accompagnants) | ❌ **Une seule table `users`** |
| Pas d'authentification | ❌ **Authentification email/password requise** |
| StorageLocal avec rôle/ID | ✅ **Token JWT stocké** (futur) |
| Emails génériques (medecin@, patient@) | ❌ **Emails nominatifs (nom+prenom@memoria.com)** |

---

## 🔄 Première Connexion

1. Se connecter avec les credentials nominatifs (ex: jeandupont@memoria.com)
2. Remplir le profil (si `profileCompleted = false`)
3. Accepter les conditions d'utilisation
4. Accès à l'interface correspondant au rôle

---

## 🚀 Pour Ajouter un Nouvel Utilisateur

**Via SQL directement:**
```sql
INSERT INTO users (nom, prenom, email, telephone, role, actif, adresse, password, profile_completed)
VALUES ('Blanc', 'Jean', 'jeanblanc@memoria.com', '06123456789', 'PATIENT', true, '25 Rue de la Paix, Paris', 'NewPass123!', false);
```

**Format Email Requis:** `prenom+nom@memoria.com` (minuscules, sans accents)

---

## 📞 Support

- Email: support@memoria.com
- Tel: +33 1 23 45 67 89

---

**Version:** 1.0  
**Dernière mise à jour:** Avril 2026

