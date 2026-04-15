# 🧠 MemorIA - Plateforme de Soins Connectés

**Une solution innovante pour accompagner les patients atteints de troubles cognitifs (Alzheimer et apparentés) et leurs aidants.**

MemorIA est une plateforme collaborative qui brise l’isolement, centralise le suivi médical et administratif, et facilite la communication en temps réel entre patients, proches aidants et professionnels de santé.

---

## 📝 Overview

MemorIA permet de créer des **communautés de soins** sécurisées, de gérer un **calendrier partagé**, de suivre l’évolution des symptômes via des outils de monitoring intelligents, et de centraliser les **dossiers médicaux**, les traitements et les documents administratifs.

L’application est construite avec une **architecture microservices** complète : **Eureka Server** (découverte de services), **API Gateway** (routage centralisé) et **OpenFeign** (communication inter-services), conformément aux exigences du Sprint 2 du module PI-Dev (SAE Développement Spring-Angular – Année universitaire 2025-2026).

---

## ✨ Features

*(Les fonctionnalités restent identiques à la version précédente – je ne les ai pas répétées ici pour garder le message clair, mais elles sont toutes incluses dans le README final)*

---

## 🛠 Tech Stack

### Frontend
- **Angular** (dernière version stable)
- Gestion d’état avancée (NgRx / Signals)
- Interface responsive et accessible

### Backend
- **Java 17+** + **Spring Boot 3**
- **Spring Cloud Netflix Eureka Server** – Service Discovery & Registry
- **Spring Cloud Gateway** – API Gateway (routage, filtrage et sécurité)
- **OpenFeign** – Communication inter-services
- **Spring Security + JWT** – Authentification et autorisation granulaire (Gateway + Microservices)
- **Hibernate / JPA** + PostgreSQL
- Tests unitaires & d’intégration **JUnit 5 + Mockito** (backend) et **Jasmine/Karma** (frontend)

### Architecture
- Architecture **Microservices** complète et évolutive
- **Eureka Server** pour la découverte automatique des services
- **API Gateway** pour le routage centralisé et la gestion des requêtes
- Communication inter-services via **OpenFeign**
- Modèle **MVC** côté backend
- Relations complexes entre entités (User ↔ Community ↔ MedicalRecord ↔ Treatment ↔ Activity ↔ Publication, etc.)
- Sécurité JWT appliquée à deux niveaux (Gateway + chaque Microservice)

---

## 🚀 Getting Started

### Pré-requis
- JDK 17 ou supérieur
- Maven 3.9+
- Node.js 20+ & Angular CLI
- Base de données PostgreSQL
- Clés API : **Stripe** + **Groq** (optionnel)

### Installation & Lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/abirgmd/Esprit-PIDEV-4SAE3-2026-Memoria.git
cd Esprit-PIDEV-4SAE3-2026-Memoria

# 2. Lancer Eureka Server (Service Discovery)
cd backend/eureka-server
mvn spring-boot:run

# 3. Lancer API Gateway
cd ../api-gateway
mvn spring-boot:run

# 4. Lancer les microservices (dans des terminaux séparés)
cd ../auth-service      && mvn spring-boot:run
cd ../community-service && mvn spring-boot:run
cd ../medical-service   && mvn spring-boot:run
# ... (autres services)

# 5. Frontend
cd ../../frontend
npm install
ng serve
