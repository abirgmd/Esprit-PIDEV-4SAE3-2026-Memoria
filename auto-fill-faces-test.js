// ================================================================
// SCRIPT DE TEST - REMPLIR LE FORMULAIRE FACES AUTOMATIQUEMENT
// ================================================================
// INSTRUCTIONS:
// 1. Ouvrez http://localhost:4200/personalized-test?type=FACES&patientId=1&patientName=Robert%20Lefebvre&stage=STABLE
// 2. Appuyez sur F12 pour ouvrir la console
// 3. Collez ce script entier et appuyez sur Entrée
// 4. Le formulaire sera rempli automatiquement
// ================================================================

console.log('🚀 Démarrage du test automatisé FACES...');

// Attendre que Angular soit chargé
setTimeout(() => {
    // Obtenir l'instance du composant via NgZone (démo simplifié)
    // En réalité, on va remplir directement les champs du DOM
    
    // 1. REMPLIR LES ITEMS (Questions/Réponses)
    
    // Item 1
    const item1Question = document.querySelector('input[placeholder="Qui est cette personne ?"]');
    const item1Nom = document.querySelector('input[placeholder="Ex: Jean Dupont"]');
    const item1Lien = document.querySelector('input[name="lien_0"][value="Médecin"]');
    const item1Reponse = document.querySelector('input[placeholder="Réponse correcte"]');
    const item1Score = document.querySelector('input[type="number"][min="1"][max="10"]');
    
    if (item1Question) {
        item1Question.value = 'Qui est cette personne ?';
        item1Question.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    if (item1Nom) {
        item1Nom.value = 'Dr. Jean Dupont';
        item1Nom.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    if (item1Lien) {
        item1Lien.checked = true;
        item1Lien.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    if (item1Reponse) {
        item1Reponse.value = 'Dr. Jean Dupont - Médecin';
        item1Reponse.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    if (item1Score) {
        item1Score.value = '5';
        item1Score.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    console.log('✅ Item 1 rempli');
    
    // Ajouter un deuxième item
    const addBtn = document.querySelector('.btn-add-item');
    if (addBtn) {
        addBtn.click();
        console.log('✅ Item 2 ajouté');
    }
    
    // Attendre un peu pour que l'item 2 soit créé dans le DOM
    setTimeout(() => {
        // Item 2
        const inputs = document.querySelectorAll('input[placeholder="Ex: Jean Dupont"]');
        const item2Nom = inputs[inputs.length - 1];
        
        const questions = document.querySelectorAll('input[placeholder="Qui est cette personne ?"]');
        const item2Question = questions[questions.length - 1];
        
        const reponsas = document.querySelectorAll('input[placeholder="Réponse correcte"]');
        const item2Reponse = reponsas[reponsas.length - 1];
        
        const scores = document.querySelectorAll('input[type="number"][min="1"][max="10"]');
        const item2Score = scores[scores.length - 1];
        
        if (item2Nom) {
            item2Nom.value = 'Infirmière Marie Martin';
            item2Nom.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (item2Question) {
            item2Question.value = 'Qui soigne ce patient ?';
            item2Question.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (item2Reponse) {
            item2Reponse.value = 'Marie Martin - Infirmière';
            item2Reponse.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (item2Score) {
            item2Score.value = '5';
            item2Score.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Sélectionner Infirmier pour item 2
        const liens = document.querySelectorAll('input[name*="lien_"]');
        for (let lien of liens) {
            if (lien.value === 'Infirmier') {
                lien.checked = true;
                lien.dispatchEvent(new Event('change', { bubbles: true }));
                break;
            }
        }
        
        console.log('✅ Item 2 rempli');
        
        // 2. REMPLIR LA DATE LIMITE
        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
            dateInput.value = '2026-02-28';
            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✅ Date limite remplie: 2026-02-28');
        }
        
        // 3. REMPLIR LE SÉLECT DES AIDANTS
        const selectAidant = document.querySelector('select');
        if (selectAidant && selectAidant.options.length > 1) {
            selectAidant.value = selectAidant.options[1].value; // Première option réelle
            selectAidant.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✅ Aidant sélectionné');
        }
        
        // 4. REMPLIR LES INSTRUCTIONS
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.value = 'Test automatisé pour validation des visages';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✅ Instructions remplies');
        }
        
        console.log('');
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ FORMULAIRE REMPLI AVEC SUCCÈS!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('');
        console.log('📊 RÉSUMÉ:');
        console.log('- Type: FACES (Mémoire des visages)');
        console.log('- Patient: Robert Lefebvre (ID: 1)');
        console.log('- Items: 2 personnes à reconnaître');
        console.log('- Date limite: 2026-02-28');
        console.log('');
        console.log('👉 CLIQUEZ MAINTENANT SUR "CRÉER ET ASSIGNER" POUR SOUMETTRE');
        console.log('═══════════════════════════════════════════════════════');
        
    }, 500);
    
}, 1000);

console.log('⏳ Veuillez patienter... Le formulaire se remplit...');
