Voici la documentation complète de MemoriA, enrichie avec :

🔐 Keycloak (authentification & gestion des rôles)

🌐 Architecture microservices (Gateway + Eureka)

🛡 Sécurité JWT

📩 Email verification

🔁 Forgot password

🚀 Préparation DevOps (Docker / Kubernetes)

MemoriA — Plateforme Sécurisée de Suivi Cognitif Alzheimer

Plateforme numérique sécurisée dédiée à l’évaluation cognitive des patients atteints de la maladie d’Alzheimer.
Architecture microservices sécurisée avec Keycloak, API Gateway et Service Discovery.

Table des matières

Présentation du projet

Architecture globale

Architecture sécurité (Keycloak)

Architecture microservices

Stack technologique

Installation et démarrage

Authentification & Autorisation

Entités et modèle de données

API REST — Endpoints

Logique métier avancée

Interface utilisateur

Sécurité et bonnes pratiques

Architecture DevOps (CI/CD)

1️⃣ Présentation du projet
🎯 Objectif

MemoriA permet :

Aux médecins (ROLE_MEDECIN) de créer et assigner des tests cognitifs.

Aux aidants (ROLE_AIDANT) de suivre l’évolution cognitive du patient.

Aux patients (ROLE_PATIENT) de passer les tests.

Aux administrateurs (ROLE_ADMIN) de gérer les utilisateurs.

2️⃣ Architecture Globale
Frontend (Angular 18)
        ↓
API Gateway (Spring Cloud Gateway)
        ↓
---------------------------------------
|  User Service                     |
|  Cognitive Test Service           |
|  Metrics Service                  |
---------------------------------------
        ↓
PostgreSQL
        ↓
Keycloak (Authentication Server)
        ↓
Eureka (Service Discovery)
3️⃣ Architecture Sécurité — Keycloak
🔐 Authentification

MemoriA utilise Keycloak comme serveur d'identité.

Fonctionnalités activées :

JWT Access Token

Refresh Token

Email verification

Forgot password

Gestion des rôles

RBAC (Role-Based Access Control)

👥 Rôles définis
Rôle	Description
ROLE_ADMIN	Administration système
ROLE_MEDECIN	Création et analyse des tests
ROLE_AIDANT	Consultation des métriques
ROLE_PATIENT	Passage des tests
🔑 Flux d’authentification
Utilisateur → Keycloak Login Page
          → JWT Token
          → API Gateway (validation JWT)
          → Microservices
📩 Email Verification

Activée au niveau du realm

SMTP configuré

Utilisateur ne peut pas se connecter si email non vérifié

🔁 Forgot Password

Géré entièrement par Keycloak :

Reset password via email

Token temporaire sécurisé

Expiration automatique

Spring Boot ne gère jamais les mots de passe.

4️⃣ Architecture Microservices
🔎 Service Discovery

Utilisation de Eureka Server.

Chaque service s’enregistre automatiquement :

user-service

cognitive-test-service

metrics-service

api-gateway

🌐 API Gateway

Point d’entrée unique

Validation JWT

Routing dynamique

Protection des endpoints

Exemple :

/api/users/** → user-service
/api/tests/** → cognitive-test-service
/api/metrics/** → metrics-service
5️⃣ Stack Technologique
Backend

Java 17

Spring Boot 3.2

Spring Security 6

Spring Cloud Gateway

Spring Cloud Netflix Eureka

Spring Data JPA

Hibernate 6

PostgreSQL 14+

Maven

Frontend

Angular 18

TypeScript 5.5

Angular Material

Chart.js

RxJS

TailwindCSS

Sécurité

Keycloak 24+

OAuth2

JWT

RBAC

DevOps

Docker

Docker Hub

Jenkins

Kubernetes

Helm (prévu)

6️⃣ Installation et Démarrage
Base de données
CREATE DATABASE "alzheimer-tests";
Lancer Keycloak
docker run -d \
--name keycloak \
-p 9090:8080 \
-e KEYCLOAK_ADMIN=admin \
-e KEYCLOAK_ADMIN_PASSWORD=admin \
quay.io/keycloak/keycloak:latest \
start-dev
Lancer Eureka

Port 8761

http://localhost:8761
Lancer API Gateway

Port 8080

Lancer Services

user-service (8081)

cognitive-test-service (8090)

metrics-service (8091)

7️⃣ Authentification & Autorisation
🔒 Protection Backend

Dans API Gateway :

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:9090/realms/MemoriA_realm
🔑 Protection des endpoints

Exemples :

Endpoint	Rôle requis
POST /api/cognitive-tests	ROLE_MEDECIN
GET /api/metrics/aidant/**	ROLE_AIDANT
POST /api/assignations	ROLE_MEDECIN
GET /api/test-results/patient/**	ROLE_PATIENT
8️⃣ Entités & Modèle de Données

Relations principales :

User (Keycloak)
   ↓
Patient
   ↓
Assignation
   ↓
TestResult (zScore)
   ↓
CognitiveScoreHistory
9️⃣ API REST
Tests cognitifs

GET /api/cognitive-tests

POST /api/cognitive-tests

PUT /api/cognitive-tests/{id}

DELETE /api/cognitive-tests/{id}

Assignations

POST /api/assignations

POST /api/assignations/personalized

Résultats

GET /api/test-results/patient/{id}

Métriques

GET /api/metrics/aidant/{aidantId}/score-global

🔟 Logique Métier Avancée
📊 Calcul z-score
scorePercentage = (scoreTotale / test.totalScore) × 100
zScore = (scorePercentage - 70) / 15
📈 Score Global Composite
z_global = Σ(poids × z_moyen) / Σ(poids)
🚦 Interprétation
z_global	Statut
> -1	Normal
-2 à -1	Surveillance
< -2	Alerte
11️⃣ Interface Utilisateur

Pages principales :

/login (Keycloak)

/dashboard

/tests-cognitifs

/aidant-metrics

/personalized-test-form

Score global affiché dynamiquement avec code couleur.

12️⃣ Sécurité & Bonnes Pratiques

HTTPS obligatoire en production

Secrets stockés dans Kubernetes Secrets

JWT validé uniquement au Gateway

Pas de stockage de mot de passe dans Spring

Rotation des clés activée dans Keycloak

RBAC strict

13️⃣ Architecture DevOps
🔁 Pipeline CI/CD
GitHub
   ↓
Jenkins
   ↓
Build Maven
   ↓
Docker Build
   ↓
Docker Push
   ↓
Kubernetes Deploy
🐳 Docker

Chaque service possède :

Dockerfile

Image versionnée

Tag latest + version

☸ Kubernetes

Chaque service déployé via :

Deployment

Service

ConfigMap

Secret

Ingress

🎯 Architecture Finale
Client
  ↓
Ingress (K8s)
  ↓
API Gateway
  ↓
Microservices
  ↓
PostgreSQL
  ↓
Keycloak
🚀 Conclusion

MemoriA est désormais :

✔ Sécurisé par Keycloak
✔ Structuré en microservices
✔ Scalabilité via Kubernetes
✔ DevOps-ready
✔ Conforme aux bonnes pratiques OAuth2

Si tu veux maintenant, je peux :

🔥 Générer un diagramme architecture professionnel en image

📄 Générer un PDF prêt à rendre

🧱 Générer docker-compose complet

☸ Générer fichiers Kubernetes YAML

📊 Générer une présentation PowerPoint soutenance
