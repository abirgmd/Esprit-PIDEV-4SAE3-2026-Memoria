import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Plus, Trash2, Save, Image as ImageIcon, Music, Type, User } from 'lucide-angular';
import { AssignationService } from '../../services/assignation.service';
import { PersonalizedTestRequest, PersonalizedTestItem, AccompagnantDTO } from '../../models/cognitive-models';

@Component({
    selector: 'app-personalized-test-form',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './personalized-test-form.component.html',
    styleUrls: ['./personalized-test-form.component.css']
})
export class PersonalizedTestFormComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private assignationService = inject(AssignationService);

    testType = signal<string>('');
    patientId = signal<number>(0);
    patientName = signal<string>('');
    stage = signal<'STABLE' | 'MOYEN' | 'CRITIQUE'>('STABLE');
    testTitle = signal<string>('');

    // Common Fields
    dateLimite = signal<string>('');
    instructions = signal<string>('');
    selectedAidantId = signal<number | null>(null);

    // Items
    items = signal<PersonalizedTestItem[]>([]);

    // Aidants List (Mocked or Fetched)
    aidants = signal<AccompagnantDTO[]>([]);
    
    // Patient and soignant data
    patientData = signal<any>(null);
    soignantData = signal<any>(null);

    readonly icons = { ChevronLeft, Plus, Trash2, Save, ImageIcon, Music, Type, User };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.testType.set(params['type'] || 'FACES');
            this.patientId.set(Number(params['patientId']) || 0);
            this.patientName.set(params['patientName'] || 'Patient');
            this.stage.set(params['stage'] || 'STABLE');

            this.initializeForm();
            this.loadAidants();
            this.loadPatientData();
        });
    }

    loadPatientData() {
        const patientId = this.patientId();
        if (patientId && patientId > 0) {
            // Récupérer les données du patient avec son médecin
            this.assignationService.getAllPatientsWithMedecin().subscribe((patients: any[]) => {
                const patient = patients.find(p => p.id === patientId);
                if (patient) {
                    this.patientData.set(patient);
                    this.patientName.set(`${patient.prenom} ${patient.nom}`);
                    this.soignantData.set(patient.medecin);
                    console.log('Patient trouvé:', patient);
                    console.log('Médecin associé:', patient.medecin);
                } else {
                    console.error('Patient non trouvé avec ID:', patientId);
                }
            });
        }
    }

    initializeForm() {
        const type = this.testType();
        let title = '';

        switch (type) {
            case 'FACES': title = 'Mémoire des visages personnalisée'; break;
            case 'CROSSWORDS': title = 'Mots croisés personnalisés'; break;
            case 'MEMORY': title = 'Memory personnalisé'; break;
            case 'SCENTS': title = 'Reconnaissance d\'odeurs personnalisée'; break;
            case 'RELATIVES': title = 'Reconnaissance des proches personnalisée'; break;
            case 'SONGS': title = 'Chansons personnalisées'; break;
            default: title = 'Test Personnalisé';
        }
        this.testTitle.set(title);

        // Add one empty item by default
        this.addItem();
    }

    loadAidants() {
        // Fetch aidants for the patient or global
        this.assignationService.getAllAidants().subscribe((aidants: AccompagnantDTO[]) => {
            this.aidants.set(aidants);
        });
    }

    addItem() {
        // Default structure based on type
        const newItem: PersonalizedTestItem = {
            question: '',
            reponse: '',
            score: 1,
            metadata: {}
        };

        // Pre-fill question text based on type expectations to guide user?
        if (this.testType() === 'FACES') newItem.question = 'Qui est cette personne ?';
        if (this.testType() === 'RELATIVES') newItem.question = 'Qui est sur cette photo ?';
        if (this.testType() === 'SCENTS') newItem.question = 'Quelle odeur est-ce ?';
        if (this.testType() === 'MEMORY') newItem.question = 'Trouvez la paire identique';
        if (this.testType() === 'SONGS') newItem.question = 'Reconnaissez-vous cette chanson ?';

        this.items.update(items => [...items, newItem]);
    }

    removeItem(index: number) {
        this.items.update(items => items.filter((_, i) => i !== index));
    }

    // File Upload Helper (Simulated)
    onFileSelected(event: any, index: number) {
        const file = event.target.files[0];
        if (file) {
            // In a real app, upload to server and get URL.
            // Here we use a fake URL or base64 for demo if possible, or just a placeholder name
            // "image_url = chemin de l'image uploadée"
            const fakeUrl = `assets/uploads/${file.name}`;

            this.items.update(items => {
                const updated = [...items];
                updated[index].imageUrl = fakeUrl;
                // also store filename in metadata if needed
                return updated;
            });
        }
    }

    submitForm() {
        // Validation
        if (!this.dateLimite()) {
            alert('⚠️ Veuillez définir une DATE LIMITE');
            return;
        }

        if (this.items().length === 0) {
            alert('⚠️ Veuillez ajouter au moins un élément au test');
            return;
        }

        // Validate each item based on type
        for (let i = 0; i < this.items().length; i++) {
            const item = this.items()[i];

            if (!item.question || item.question.trim() === '') {
                alert(`⚠️ Item ${i + 1}: La QUESTION est obligatoire`);
                return;
            }

            if (!item.reponse || item.reponse.trim() === '') {
                alert(`⚠️ Item ${i + 1}: La RÉPONSE est obligatoire`);
                return;
            }

            if (this.testType() === 'FACES' || this.testType() === 'RELATIVES') {
                if (!item.metadata['nom'] || item.metadata['nom'].trim() === '') {
                    alert(`⚠️ Item ${i + 1}: Le NOM est obligatoire`);
                    return;
                }
                if (!item.metadata['lien'] || item.metadata['lien'].trim() === '') {
                    alert(`⚠️ Item ${i + 1}: Le LIEN avec le patient est obligatoire`);
                    return;
                }
            }

            if (this.testType() === 'SCENTS') {
                if (!item.metadata['description'] || item.metadata['description'].trim() === '') {
                    alert(`⚠️ Item ${i + 1}: La DESCRIPTION de l'odeur est obligatoire`);
                    return;
                }
            }

            if (this.testType() === 'SONGS') {
                if (!item.metadata['titre'] || item.metadata['titre'].trim() === '') {
                    alert(`⚠️ Item ${i + 1}: Le TITRE de la chanson est obligatoire`);
                    return;
                }
                if (!item.metadata['artiste'] || item.metadata['artiste'].trim() === '') {
                    alert(`⚠️ Item ${i + 1}: L'ARTISTE est obligatoire`);
                    return;
                }
            }
        }

        // Créer la requête SANS soignantId (il sera récupéré automatiquement)
        const request: PersonalizedTestRequest = {
            patientId: this.patientId(),
            soignantId: undefined, // Sera récupéré automatiquement depuis le patient
            accompagnantId: this.selectedAidantId() || undefined,
            titre: `${this.testTitle()} - ${this.patientName()}`,
            description: `Test personnalisé de type ${this.testType()}`,
            stage: this.stage(),
            dateLimite: this.dateLimite(),
            instructions: this.instructions(),
            items: this.items()
        };

        console.log('Submitting Personalized Test:', request);
        console.log('Médecin qui sera assigné automatiquement:', this.soignantData());

        this.assignationService.createPersonalizedAssignation(request).subscribe({
            next: (res: any) => {
                alert('✅ Test créé et assigné avec succès !\nMédecin assigné automatiquement: ' + 
                      (this.soignantData()?.prenom + ' ' + this.soignantData()?.nom || 'Non spécifié'));
                this.router.navigate(['/tests-cognitifs']); // Back to dashboard
            },
            error: (err: any) => {
                console.error('Error creating test:', err);
                console.error('Error details:', err.error);
                const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
                alert(`❌ Erreur: ${errorMsg}`);
            }
        });
    }

    cancel() {
        this.router.navigate(['/tests-cognitifs']);
    }
}
