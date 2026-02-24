# Guide de Test - Formulaire de Test Personnalisé

## Configuration Actuelle

- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:8081
- **Type de Formulaire**: Personnalisé (Cognition Customisé)

## Données de Test Disponibles

### Soignants (Médecins)
| ID  | Nom     | Prénom | Spécialité   |
|-----|---------|--------|--------------|
| 101 | Simon   | Claire | Gériatrie    |
| 102 | Vidal   | Marc   | Neurologie   |
| 103 | Bernard | Thomas | Psychiatrie  |

### Patients
Les patients seront créés automatiquement à la première démarrage. Vérifiez-les à:
- http://localhost:8081/api/assignations/patients/all

### Accompagnants (Aidants)
Disponibles à travers le formulaire une fois un patient sélectionné.

## Test 1: Mémoire des Visages (FACES)

### URL du Formulaire
```
http://localhost:4200/personalized-test?type=FACES&patientId=1&patientName=Robert%20Lefebvre&stage=STABLE
```

### Steps pour Tester
1. **Remplissez le formulaire avec:**
   - Photo: Sélectionnez une image locale (optionnel)
   - Nom: "Alice Lefebvre"
   - Lien: "Fille"
   - Question: "Qui est cette personne?"
   - Réponse attendue: "Alice"
   - Points: 1

2. **Ajoutez un deuxième élément** en cliquant "AJOUTER UN ÉLÉMENT"
   - Créez d'autres entrées

3. **Configuration finale:**
   - Date limite: Sélectionnez une date future
   - Assigner à: Sélectionnez un accompagnant (optionnel)
   - Instructions: Entrez  des instructions

4. **Soumettez** en cliquant "CRÉER ET ASSIGNER"

### Résultats Attendus
- ✅ Affiche "Test créé et assigné avec succès!"
- ✅ Les données apparaissent dans la base de données
- ✅ Redirection vers `/tests-cognitifs`

---

## Test 2: Mots Croisés (CROSSWORDS)

### URL
```
http://localhost:4200/personalized-test?type=CROSSWORDS&patientId=1&patientName=Robert%20Lefebvre&stage=STABLE
```

### Steps
1. Taille de la grille: Sélectionnez 6x6
2. Ajoutez des mots:
   - Mot: "MAISON"
   - Indice: "Lieu de résidence"
   - Direction: "HORIZONTAL"
   - Position: "1,1"
   - Points: 1

3. Testez l'ajout de plusieurs mots
4. Soumettez le formulaire

---

## Test 3: Memory (Jeu de Paires)

### URL
```
http://localhost:4200/personalized-test?type=MEMORY&patientId=1&patientName=Robert%20Lefebvre&stage=MOYEN
```

### Steps
1. Uploadez une image
2. Description: "Chat orange"
3. Question: "Trouvez la paire identique"
4. Points: 2

---

## Test 4: Odeurs (SCENTS)

### URL
```
http://localhost:4200/personalized-test?type=SCENTS&patientId=1&patientName=Robert%20Lefebvre&stage=MOYEN
```

### Steps
1. Description: "Café du matin"
2. Question: "Quelle odeur est-ce?"
3. Réponse: "Café"
4. Points: 1

---

## Test 5: Reconnaissance des Proches (RELATIVES)

### URL
```
http://localhost:4200/personalized-test?type=RELATIVES&patientId=1&patientName=Robert%20Lefebvre&stage=CRITIQUE
```

### Steps
1. Uploadez une photo de famille
2. Nom: "Marguerite Lefebvre"
3. Lien: "Épouse"
4. Question: "Qui est sur cette photo?"
5. Réponse: "Marguerite"

---

## Test 6: Chansons (SONGS)

### URL
```
http://localhost:4200/personalized-test?type=SONGS&patientId=1&patientName=Robert%20Lefebvre&stage=CRITIQUE
```

### Steps
1. Titre: "La Vie en Rose"
2. Artiste: "Édith Piaf"
3. Contexte: "Mariage de jeunesse"
4. Question: "Reconnaissez-vous cette chanson?"
5. Réponse: "Oui"

---

## Dépannage

### ❌ Erreur: "Patient not found"
- Vérifiez que `patientId` correspond à un patient existant
- Consultez: http://localhost:8081/api/assignations/patients/all

### ❌ Erreur: "Soignant not found"
- Le formulaire utilise `soignantId: 101` par défaut
- Les IDs valides sont: 101, 102, 103
- Consultez: http://localhost:8081/api/assignations/debug/soignants

### ❌ Erreur: "400 Bad Request"
- Vérifiez que tous les champs obligatoires sont remplis
- Vérifiez le format de la date (YYYY-MM-DD)
- Consultez la console du navigateur pour plusdétails

### ❌ Les données ne sont pas sauvegardées
1. Vérifiez que le backend est en cours d'exécution
2. Vérifiez les logs du backend: `netstat -ano | Select-String "8081"`
3. Vérifiez que PostgreSQL est actif
4. Consultez les erreurs dans la console du navigateur (F12)

---

## Vérification des Données Sauvegardées

### Après chaque test, vérifiez:

1. **API Endpoint**: http://localhost:8081/api/assignations/patient/1/tests

2. **Logs du Navigateur** (F12):
   ```javascript
   // La réponse du serveur devrait contenir l'ID du test créé
   ```

3. **Logs du Backend**:
   - Vérifiez les erreurs SQL
   - Vérifiez les validations

---

## Checklist de Validation

- [ ] Formulaire FACES fonctionne
- [ ] Formulaire CROSSWORDS fonctionne
- [ ] Formulaire MEMORY fonctionne
- [ ] Formulaire SCENTS fonctionne
- [ ] Formulaire RELATIVES fonctionne
- [ ] Formulaire SONGS fonctionne
- [ ] Les données sont bien sauvegardées en BD
- [ ] L'API retourne les tests créés
- [ ] Messages d'erreur appropriés

---

## Notes Importante

- Le `soignantId` par défaut est **101** (Claire Simon)
- Les IDs de patients dépendent de l'ordre de création
- Les métadonnées dans le formulaire sont stockées dans le champ `explanation` de la question
