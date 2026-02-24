# Plan de Test Complet - Formulaires Personnalisés

## 📋 Résumé
Testons les 6 types de formulaires personnalisés (FACES, CROSSWORDS, MEMORY, SCENTS, RELATIVES, SONGS)

## ✅ Test 1: FACES (Mémoire des visages)
**URL:** `http://localhost:4200/personalized-test?type=FACES&patientId=1&patientName=Robert%20Lefebvre&stage=STABLE`

### Données à entrer:
**Item 1:**
- Nom: Jean Dupont
- Lien: Médecin
- Question: Qui est cette personne ?
- Réponse: Jean Dupont - Médecin

**Item 2:**
- Nom: Marie Martin
- Lien: Infirmière
- Question: Qui est cette personne ?
- Réponse: Marie Martin - Infirmière

**Champs communs:**
- Date limite: 28/02/2026
- Assigner à: Alice Lefebvre (Fille)
- Instructions: Test de reconnaissance faciale avec deux médecins

---

## ✅ Test 2: CROSSWORDS (Mots croisés)
**URL:** `http://localhost:4200/personalized-test?type=CROSSWORDS&patientId=2&patientName=Marie%20Lefebvre&stage=MOYEN`

### Données à entrer:
**Taille grille:** 6x6

**Items (Mots personnalisés):**
- Mot 1: PARIS (célèbre capitale française)
- Mot 2: MÈRE (maman)
- Mot 3: AMITIÉ (sentiment)

**Champs communs:**
- Date limite: 28/02/2026
- Instructions: Résolvez les mots croisés avec les définitions proposées

---

## ✅ Test 3: MEMORY (Jeu de paires)
**URL:** `http://localhost:4200/personalized-test?type=MEMORY&patientId=3&patientName=Pierre%20Lefebvre&stage=CRITIQUE`

### Données à entrer:
**Items (Paires d'images/mots):**
- Paire 1: Pomme / Fruits rouges
- Paire 2: Fleur / Nature
- Paire 3: Maison / Habitat

**Champs communs:**
- Date limite: 28/02/2026
- Instructions: Trouvez les paires identiques

---

## ✅ Test 4: SCENTS (Reconnaissance d'odeurs)
**URL:** `http://localhost:4200/personalized-test?type=SCENTS&patientId=4&patientName=Sophie%20Martin&stage=MOYEN`

### Données à entrer:
**Item 1:**
- Description: Café du matin
- Question: Quelle odeur est-ce ?
- Réponse: Café

**Item 2:**
- Description: Lavande fraîche
- Question: Quelle odeur est-ce ?
- Réponse: Lavande

**Champs communs:**
- Date limite: 28/02/2026
- Instructions: Identifiez les odeurs par ordre

---

## ✅ Test 5: RELATIVES (Reconnaissance des proches)
**URL:** `http://localhost:4200/personalized-test?type=RELATIVES&patientId=5&patientName=Luc%20Bernard&stage=STABLE`

### Données à entrer:
**Item 1:**
- Nom: Jacques Bernard
- Lien: Famille
- Question: Reconnaissez-vous ce proche ?
- Réponse: Jacques Bernard

**Item 2:**
- Nom: Nathalie Bernard
- Lien: Famille
- Question: Reconnaissez-vous ce proche ?
- Réponse: Nathalie Bernard

**Champs communs:**
- Date limite: 28/02/2026
- Instructions: Photos de la famille

---

## ✅ Test 6: SONGS (Chansons personnalisées)
**URL:** `http://localhost:4200/personalized-test?type=SONGS&patientId=6&patientName=Claire%20Fournier&stage=CRITIQUE`

### Données à entrer:
**Item 1:**
- Titre: La Vie en Rose
- Artiste: Édith Piaf
- Contexte: Années 1940
- Question: Reconnaissez-vous cette chanson ?
- Réponse: Oui - Édith Piaf

**Item 2:**
- Titre: Marinella
- Artiste: Tino Rossi
- Contexte: Chansons de jeunesse
- Question: Reconnaissez-vous cette chanson ?
- Réponse: Oui - Tino Rossi

**Champs communs:**
- Date limite: 28/02/2026
- Instructions: Testez votre mémoire musicale

---

## 📊 Vérification Base de Données

Après chaque test, vérifiez dans le backend:
```
GET /api/assignations/patient/{patientId}/tests
```

Les données doivent être persistées dans:
- `cognitive_tests` table
- `test_questions` table
- `patient_test_assignations` table

---

## 🐛 Dépannage

Si vous rencontrez des erreurs:
1. Vérifiez que le patient ID existe (1-7)
2. Vérifiez que tous les champs obligatoires sont remplis
3. Vérifiez les logs du backend: `GET /api/assignations/debug/soignants`
4. Vérifiez la console du navigateur (F12)
