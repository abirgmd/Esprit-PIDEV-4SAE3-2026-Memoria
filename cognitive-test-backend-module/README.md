# Module Cognitif - Backend Spring Boot

Ce module gère l'évaluation cognitive des patients, incluant la gestion des tests, l'assignation aux patients, le calcul des scores, l'aide à la décision et les recommandations.

## Architecture
- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven
- **Database**: MySQL 8.x
- **Java**: JDK 17+

## Fonctionnalités Principales
1. **Gestion des Tests Cognitifs**: CRUD pour les tests (MMSE, MoCA, etc.) et leurs questions.
2. **Assignation**: Planification des tests pour les patients avec dates limites et priorités.
3. **Résultats & Scores**: Stokage des réponses, calcul automatique des scores et interprétation.
4. **Aide à la Décision**: Algorithme basique (à base de règles) pour suggérer des actions (Surveillance, Consultation, Urgence).
5. **Recommandations**: Génération de tâches pour les médecins ou aidants.

## Structure du Projet
- `entity`: Modèle de données JPA (9 entités).
- `repository`: Accès aux données (Spring Data JPA).
- `service`: Logique métier et validation.
- `controller`: API REST exposée au frontend.
- `exception`: Gestion globale des erreurs.
- `validator`: Règles de validation spécifiques.

## Installation et Démarrage

1. **Prérequis**:
   - JDK 17 installé.
   - MySQL installé et service démarré.
   - Maven installé.

2. **Configuration Base de Données**:
   - Créez la base de données : `CREATE DATABASE cognitive_module;`
   - Vérifiez `src/main/resources/application.properties` pour les identifiants (root/root par défaut).

3. **Lancer l'Application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Tests Unitaires**:
   ```bash
   mvn test
   ```

5. **API Documentation**:
   - Swagger UI accessible à : `http://localhost:8080/swagger-ui.html` (une fois configuré).

## Données de Test
Un script SQL d'initialisation est disponible à la racine du module backend : `cognitive_db.sql`. Il contient des jeux de données pour :
- 5 Tests Cognitifs (MMSE, MoCA, etc.)
- Questions pour le MMSE
- Exemples d'assignations et de résultats
