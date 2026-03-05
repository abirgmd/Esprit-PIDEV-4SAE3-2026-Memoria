# MemoriA — Module de Tests Cognitifs

> Plateforme de suivi cognitif pour patients atteints de la maladie d'Alzheimer.
> Permet aux soignants de créer, assigner et analyser des tests cognitifs personnalisés, avec un tableau de bord clinique pour les aidants.

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Architecture technique](#2-architecture-technique)
3. [Prérequis](#3-prérequis)
4. [Installation et démarrage](#4-installation-et-démarrage)
5. [Structure du projet](#5-structure-du-projet)
6. [Entités et modèle de données](#6-entités-et-modèle-de-données)
7. [API REST — Endpoints](#7-api-rest--endpoints)
8. [Contrôle de saisie et validation](#8-contrôle-de-saisie-et-validation)
9. [Logique métier avancée](#9-logique-métier-avancée)
10. [Interface utilisateur](#10-interface-utilisateur)
11. [Stack technologique](#11-stack-technologique)

---

## 1. Présentation du projet

### Contexte

MemoriA est un module applicatif dédié à l'évaluation cognitive des patients Alzheimer. Il s'insère dans un système de santé numérique et permet :

- Aux **soignants (médecins)** de créer des tests cognitifs standards et personnalisés, de les assigner aux patients, et d'en consulter les résultats.
- Aux **aidants (accompagnants)** de suivre l'évolution cognitive du patient dont ils ont la charge, grâce à un tableau de bord avec score composite coloré.
- Aux **patients** de passer les tests depuis leur interface dédiée.

### Acteurs

| Acteur | Rôle |
|---|---|
| **Soignant** | Médecin référent — crée les tests, consulte les résultats, génère des recommandations |
| **Aidant (Accompagnant)** | Accompagnant du patient — suit le score cognitif global et les tendances |
| **Patient** | Passe les tests cognitifs assignés |

### Types de tests supportés

| Catégorie | Types |
|---|---|
| Standards | MEMORY · LANGUAGE · REFLECTION · LOGIC · AUDIO · ATTENTION · DRAWING |
| Personnalisés | FACES (visages) · CROSSWORDS (mots croisés) · MEMORY (paires) · SCENTS (odeurs) · RELATIVES (proches) · SONGS (chansons) |

---

## 2. Architecture technique

```
┌─────────────────────────────────────────────────┐
│           Angular Frontend  (port 4200)          │
│   Standalone Components · Signals · Chart.js     │
└────────────────────────┬────────────────────────┘
                         │ REST / HTTP / JSON
┌────────────────────────▼────────────────────────┐
│         Spring Boot Backend  (port 8090)         │
│   REST API · JPA/Hibernate · Bean Validation     │
│   Services : Assignation · Scoring · Metrics     │
└────────────────────────┬────────────────────────┘
                         │ JDBC / JPA
┌────────────────────────▼────────────────────────┐
│       PostgreSQL  (port 5432)                    │
│       Base : alzheimer-tests                     │
└─────────────────────────────────────────────────┘
```

> Le projet est conçu pour une migration vers une architecture microservices (Eureka client déjà configuré).

---

## 3. Prérequis

| Outil | Version minimale |
|---|---|
| Java | 17 |
| Maven | 3.8+ (ou utiliser `mvnw.cmd`) |
| Node.js | 18+ |
| npm | 9+ |
| PostgreSQL | 14+ |
| Angular CLI | 18 |

---

## 4. Installation et démarrage

### 4.1 Base de données

```sql
-- Créer la base de données PostgreSQL
CREATE DATABASE "alzheimer-tests";
```

> Hibernate gère automatiquement la création des tables au démarrage (`ddl-auto=update`).

### 4.2 Backend (Spring Boot)

```bash
cd cognitive-test-module-beckend

# Windows — depuis CMD (pas PowerShell)
mvnw.cmd spring-boot:run

# Ou avec Maven installé
mvn spring-boot:run
```

Le backend démarre sur **http://localhost:8090**

**Configuration** (`src/main/resources/application.properties`) :

```properties
server.port=8090
spring.datasource.url=jdbc:postgresql://localhost:5432/alzheimer-tests
spring.datasource.username=postgres
spring.datasource.password=123
spring.jpa.hibernate.ddl-auto=update
```

> Si votre chemin contient des parenthèses (ex : `MemoriA-int(1)`), utilisez le fichier `run-backend.bat` à la racine via CMD.

### 4.3 Frontend (Angular)

```bash
cd cognitive-test-module-frontend

npm install
npm run dev
```

Le frontend démarre sur **http://localhost:4200**

### 4.4 Migration des z-scores existants

Après le premier démarrage, appeler une seule fois pour calculer les z-scores des résultats existants :

```bash
curl -X POST http://localhost:8090/api/metrics/recalculate-zscores
```

---

## 5. Structure du projet

```
MemoriA-int(1)/
├── cognitive-test-module-beckend/
│   └── src/main/java/com/med/cognitive/
│       ├── controller/          # Endpoints REST
│       │   ├── CognitiveTestController.java
│       │   ├── AssignationController.java
│       │   ├── MetricsController.java
│       │   ├── TestResultController.java
│       │   └── ...
│       ├── service/             # Logique métier
│       │   ├── AssignationService.java     # Workflow test + calcul z-score
│       │   ├── MetricsService.java         # Score global composite
│       │   ├── CognitiveTestService.java
│       │   └── ...
│       ├── entity/              # Entités JPA
│       │   ├── CognitiveTest.java
│       │   ├── TestResult.java             # Contient zScore
│       │   ├── Patient.java
│       │   ├── Accompagnant.java           # Aidant
│       │   └── ...
│       ├── dto/                 # Objets de transfert
│       │   ├── PersonalizedTestRequest.java  # Avec Bean Validation
│       │   ├── ScoreGlobalDTO.java
│       │   └── ...
│       ├── repository/          # Accès base de données (JPA)
│       ├── exception/           # Gestion centralisée des erreurs
│       │   ├── GlobalExceptionHandler.java
│       │   ├── ErrorResponse.java          # severity + colorCode
│       │   └── ...
│       └── validator/
│
└── cognitive-test-module-frontend/
    └── src/app/
        ├── pages/
        │   ├── tests-cognitifs/            # Interface principale aidant
        │   ├── personalized-test-form/     # Formulaire test personnalisé
        │   ├── aidant-metrics/             # Tableau de bord métriques
        │   └── ...
        ├── services/
        │   ├── assignation.service.ts
        │   ├── metrics.service.ts          # Score global
        │   └── ...
        └── models/
            └── cognitive-models.ts
```

---

## 6. Entités et modèle de données

### Diagramme de relations simplifié

```
Soignant ──────────────────┐
                           │ (1)
Patient ──── Accompagnant  │
  │(id)        (patient_id)│
  │                        │
PatientTestAssign ──── CognitiveTest
  │(patient_id)   (test_id)    │
  │                            │
TestResult ────────────────────┘
  │(zScore calculé à la complétion)
  │
CognitiveScoreHistory
```

### Champs clés de TestResult

| Champ | Type | Description |
|---|---|---|
| `scoreTotale` | Integer | Points obtenus |
| `maxPossibleScore` | Integer | Score max du test |
| `scorePercentage` | Double | Pourcentage de réussite |
| `zScore` | Double | z-score calculé et stocké à la complétion |
| `isValid` | Boolean | Résultat valide pour le calcul du score global |

---

## 7. API REST — Endpoints

### Tests cognitifs

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/cognitive-tests` | Liste tous les tests (filtres disponibles) |
| GET | `/api/cognitive-tests/{id}` | Détail d'un test |
| POST | `/api/cognitive-tests` | Créer un test |
| PUT | `/api/cognitive-tests/{id}` | Modifier un test |
| DELETE | `/api/cognitive-tests/{id}` | Supprimer un test |
| PATCH | `/api/cognitive-tests/{id}/activate` | Activer/désactiver |
| POST | `/api/cognitive-tests/{id}/duplicate` | Dupliquer un test |

### Assignations

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/assignations` | Toutes les assignations |
| POST | `/api/assignations` | Assigner un test standard |
| POST | `/api/assignations/personalized` | Créer et assigner un test personnalisé |
| GET | `/api/assignations/medecin/{id}` | Assignations d'un médecin |
| GET | `/api/assignations/patient/{id}` | Assignations d'un patient |

### Résultats et métriques

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/test-results/patient/{id}` | Résultats d'un patient |
| GET | `/api/metrics/aidant/{aidantId}/score-global` | Score cognitif global pour un aidant |
| POST | `/api/metrics/recalculate-zscores` | Recalculer les z-scores existants (migration) |

### Format de réponse d'erreur

```json
{
  "timestamp": "2026-03-05T10:30:00",
  "status": 400,
  "error": "Erreur de validation",
  "message": "Veuillez corriger les champs indiqués avant de soumettre le formulaire.",
  "severity": "ERROR",
  "colorCode": "#EF4444",
  "validationErrors": {
    "titre": "Le titre doit contenir entre 3 et 255 caractères",
    "items[0].reponse": "La réponse de l'élément est obligatoire",
    "dateLimitString": "La date limite est obligatoire"
  }
}
```

---

## 8. Contrôle de saisie et validation

### Niveau Backend — Jakarta Bean Validation

Toutes les contraintes sont déclarées sur `PersonalizedTestRequest` et validées automatiquement via `@Valid` sur l'endpoint.

| Champ | Contraintes |
|---|---|
| `patientId` | `@NotNull` |
| `titre` | `@NotBlank` · `@Size(min=3, max=255)` |
| `dateLimitString` | `@NotBlank` |
| `description` | `@Size(max=1000)` |
| `instructions` | `@Size(max=2000)` |
| `items` | `@NotEmpty` · `@Valid` (cascade) |
| `items[i].question` | `@NotBlank` |
| `items[i].reponse` | `@NotBlank` |
| `items[i].score` | `@NotNull` · `@Min(1)` · `@Max(10)` |

### Niveaux de gravité des erreurs

| Situation | severity | colorCode |
|---|---|---|
| Ressource introuvable (404) | `WARNING` | `#F59E0B` (orange) |
| Erreur de validation (400) | `ERROR` | `#EF4444` (rouge) |
| Règle métier violée (400) | `WARNING` | `#F59E0B` (orange) |
| Erreur serveur (500) | `CRITICAL` | `#DC2626` (rouge foncé) |

### Niveau Frontend — Affichage visuel

- **Bannière colorée** en haut du formulaire (rouge / orange / vert)
- **Champ invalide** : bordure rouge + fond rosé + message inline avec icône `!`
- **Carte d'élément invalide** : surligné en rouge pâle
- **Groupe radio invalide** : encadré rouge
- **Spinner** sur le bouton pendant l'envoi
- **Bannière succès verte** + redirection automatique après 1,8 s

---

## 9. Logique métier avancée

### 9.1 Calcul du z-score individuel

Calculé et **stocké en base** à chaque complétion de test (`AssignationService.finishTest`) :

```
scorePercentage = (scoreTotale / test.totalScore) × 100
zScore = (scorePercentage - 70) / 15
```

> Baseline : 70% = performance normale attendue · Écart-type σ = 15%

### 9.2 Score Global Composite

Calculé à la demande via `GET /api/metrics/aidant/{aidantId}/score-global` :

```
z_global = Σ(poids_type × z_moyen_type) / Σ(poids_type)
```

**Pondération par type de test :**

| Type | Poids |
|---|---|
| MEMORY | 3.0 |
| PERSONNALISE | 2.5 |
| LANGUAGE · REFLECTION · LOGIC | 2.0 |
| AUDIO · ATTENTION | 1.5 |
| DRAWING | 1.0 |

**Interprétation :**

| z_global | Statut | Couleur |
|---|---|---|
| > −1 | Normal | Vert |
| −2 à −1 | Surveillance | Jaune |
| < −2 | Alerte cognitive | Rouge |
| Données insuffisantes | Non évaluable | Gris |

### 9.3 Workflow d'assignation

```
[Soignant crée]     [Patient passe]     [Résultat soumis]
   PENDING      →    IN_PROGRESS    →      COMPLETED
                                        (z-score stocké)
```

### 9.4 Moteur de décision et recommandations

- `DecisionService` : génère des décisions cliniques basées sur les résultats
- `RecommendationService` : propose des recommandations adaptées au stade (`STABLE / MOYEN / CRITIQUE`) et aux scores obtenus

---

## 10. Interface utilisateur

### Pages principales

| Page | URL | Description |
|---|---|---|
| Tests Cognitifs | `/tests-cognitifs` | Interface principale — sélection aidant, score global, planning |
| Formulaire test personnalisé | `/personalized-test-form` | Création d'un test personnalisé avec validation colorée |
| Métriques aidant | `/aidant-metrics` | Tableau de bord détaillé avec graphiques |

### Score global dans l'interface aidant

Après sélection d'un aidant, le score cognitif global de son patient s'affiche automatiquement :

```
┌─────────────────────────────────────────┐
│  SCORE COGNITIF GLOBAL                  │
│                                         │
│     −0.87      [Normal]                 │
│   (couleur verte / jaune / rouge)       │
│                                         │
│  MEMORY ▓▓▓  LANGUAGE ▓▓  LOGIC ▓▓▓   │
└─────────────────────────────────────────┘
```

---

## 11. Stack technologique

### Backend

| Technologie | Version | Usage |
|---|---|---|
| Java | 17 | Langage principal |
| Spring Boot | 3.2.3 | Framework applicatif |
| Spring Data JPA | 3.2.3 | Accès base de données |
| Spring Validation | 3.2.3 | Bean Validation (Jakarta) |
| Spring Cloud Netflix Eureka | 2023.0.1 | Découverte de services (préparé) |
| Hibernate | 6.x | ORM |
| PostgreSQL Driver | — | Connecteur JDBC |
| Lombok | — | Réduction du boilerplate |
| Maven | 3.8+ | Gestion de dépendances et build |

### Frontend

| Technologie | Version | Usage |
|---|---|---|
| Angular | 18 | Framework SPA |
| TypeScript | 5.5 | Langage principal |
| Angular Signals | 18 | Gestion d'état réactive |
| Angular Material | 18 | Composants UI |
| Chart.js / ng2-charts | 4.x / 8.x | Graphiques et visualisations |
| Lucide Angular | 0.487 | Icônes |
| RxJS | 7.8 | Programmation réactive |
| TailwindCSS | 3.4 | Utilitaires CSS |

### Base de données

| Technologie | Version | Usage |
|---|---|---|
| PostgreSQL | 14+ | Base de données principale |

---

## Auteurs

Projet développé dans le cadre d'un module applicatif de santé numérique — Suivi cognitif Alzheimer.
