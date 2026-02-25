import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OrientationQuestion {
    id: number;
    questionText: string;
    type: 'mcq' | 'text';
    options?: string[];
}

@Component({
    selector: 'app-test-orientation-simplifie',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './test-orientation-simplifie.component.html',
    styleUrls: ['./test-orientation-simplifie.component.css']
})
export class TestOrientationSimplifieComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    private timerInterval: any;

    patientName = signal('Patient');
    patientId = signal<number>(0);
    assignationId = signal<number | null>(null);
    elapsedSeconds = signal(0);
    currentIndex = signal(0);
    answers = signal<{ [key: number]: string }>({});
    isComplete = signal(false);
    finalScore = signal(0);

    questions: OrientationQuestion[] = [
        { id: 1, questionText: 'Quelle est la date d\'aujourd\'hui ?', type: 'text' },
        { id: 2, questionText: 'Quel jour de la semaine sommes-nous ?', type: 'mcq', options: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] },
        { id: 3, questionText: 'En quel mois sommes-nous ?', type: 'mcq', options: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] },
        { id: 4, questionText: 'En quelle année sommes-nous ?', type: 'text' },
        { id: 5, questionText: 'En quelle saison sommes-nous ?', type: 'mcq', options: ['Printemps', 'Été', 'Automne', 'Hiver'] },
        { id: 6, questionText: 'Dans quel pays vivez-vous ?', type: 'mcq', options: ['France', 'Belgique', 'Suisse', 'Maroc', 'Canada'] },
        { id: 7, questionText: 'Dans quelle ville sommes-nous ?', type: 'text' },
        { id: 8, questionText: 'Où êtes-vous en ce moment ?', type: 'mcq', options: ['À l\'hôpital', 'Au cabinet médical', 'À domicile', 'À la clinique', 'En maison de retraite'] },
        { id: 9, questionText: 'Quel est votre prénom ?', type: 'text' },
        { id: 10, questionText: 'En quelle année êtes-vous né(e) ?', type: 'text' },
    ];

    totalQuestions = computed(() => this.questions.length);
    currentQuestion = computed(() => this.questions[this.currentIndex()]);
    isLastQuestion = computed(() => this.currentIndex() === this.questions.length - 1);
    progressPercentage = computed(() => Math.round((this.currentIndex() / this.totalQuestions()) * 100));

    currentScore = computed(() => {
        const ans = this.answers();
        let score = 0;
        this.questions.forEach(q => {
            if (ans[q.id] && ans[q.id].trim() !== '') score++;
        });
        return score;
    });

    formattedTime = computed(() => {
        const m = Math.floor(this.elapsedSeconds() / 60);
        const s = this.elapsedSeconds() % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['patientId']) this.patientId.set(+params['patientId']);
            if (params['assignationId']) this.assignationId.set(+params['assignationId']);
            this.loadPatientInfo();
        });
        this.startTimer();
    }

    ngOnDestroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    private startTimer() {
        this.timerInterval = setInterval(() => this.elapsedSeconds.update(s => s + 1), 1000);
    }

    private loadPatientInfo() {
        const pid = this.patientId();
        if (pid) {
            this.http.get<any>(`${this.apiUrl}/assignations/patient/${pid}/tests`).subscribe({
                next: (assignments: any[]) => {
                    if (assignments && assignments.length > 0) {
                        const a = assignments[0];
                        const nom = a.patientNom || a.patient?.nom || '';
                        const prenom = a.patientPrenom || a.patient?.prenom || '';
                        this.patientName.set(`${prenom} ${nom}`.trim() || 'Patient');
                    }
                },
                error: () => {
                    this.http.get<any>(`${this.apiUrl}/users/${pid}`).subscribe({
                        next: (user) => this.patientName.set(`${user.prenom || ''} ${user.nom || ''}`.trim() || 'Patient'),
                        error: () => { }
                    });
                }
            });
        }
    }

    selectOption(option: string) {
        const q = this.currentQuestion();
        if (!q) return;
        this.answers.update(a => ({ ...a, [q.id]: option }));
    }

    getAnswer(id: number): string {
        return this.answers()[id] || '';
    }

    setAnswer(event: Event, id: number) {
        const val = (event.target as HTMLInputElement).value;
        this.answers.update(a => ({ ...a, [id]: val }));
    }

    isSelected(option: string): boolean {
        const q = this.currentQuestion();
        if (!q) return false;
        return this.answers()[q.id] === option;
    }

    goNext() {
        if (this.isLastQuestion()) this.finishTest();
        else this.currentIndex.update(i => i + 1);
    }

    goPrev() {
        if (this.currentIndex() > 0) this.currentIndex.update(i => i - 1);
    }

    private finishTest() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.finalScore.set(this.currentScore());
        this.isComplete.set(true);
        this.saveResults();
    }

    private saveResults() {
        const payload = {
            patientId: this.patientId(),
            testId: 10,
            assignationId: this.assignationId(),
            score: this.finalScore(),
            durationSeconds: this.elapsedSeconds(),
            answers: Object.entries(this.answers()).map(([qId, ans]) => ({
                questionId: parseInt(qId),
                answerText: ans
            }))
        };
        this.http.post(`${this.apiUrl}/tests/10/results`, payload).subscribe({ error: () => { } });
    }

    returnToDashboard() {
        this.router.navigate(['/tests-cognitifs']);
    }
}
