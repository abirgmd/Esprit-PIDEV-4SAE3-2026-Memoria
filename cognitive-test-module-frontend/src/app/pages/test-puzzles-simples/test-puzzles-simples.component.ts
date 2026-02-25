import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface PuzzlePiece {
    id: number;
    label: string;
    emoji: string;
    color: string;
    correctPosition: number;
    currentPosition: number | null;
}

@Component({
    selector: 'app-test-puzzles-simples',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './test-puzzles-simples.component.html',
    styleUrls: ['./test-puzzles-simples.component.css']
})
export class TestPuzzlesSimplesComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    private timerInterval: any;

    patientName = signal('Patient');
    patientId = signal<number>(0);
    assignationId = signal<number | null>(null);
    elapsedSeconds = signal(0);
    isComplete = signal(false);
    finalScore = signal(0);
    draggedPieceId = signal<number | null>(null);
    activeStep = signal(0);

    puzzles = [
        {
            id: 1, title: 'Puzzle Animaux', description: 'Assemblez les pièces pour former un animal',
            pieces: [
                { id: 1, label: 'Tête', emoji: '🐶', color: '#FFD93D', correctPosition: 0, currentPosition: null as number | null },
                { id: 2, label: 'Corps', emoji: '🦴', color: '#6BCB77', correctPosition: 1, currentPosition: null as number | null },
                { id: 3, label: 'Pattes', emoji: '🐾', color: '#4D96FF', correctPosition: 2, currentPosition: null as number | null },
                { id: 4, label: 'Queue', emoji: '〰️', color: '#FF6B6B', correctPosition: 3, currentPosition: null as number | null },
            ]
        },
        {
            id: 2, title: 'Puzzle Maison', description: 'Construisez une maison',
            pieces: [
                { id: 5, label: 'Toit', emoji: '🏠', color: '#FF6B6B', correctPosition: 0, currentPosition: null as number | null },
                { id: 6, label: 'Murs', emoji: '🧱', color: '#FFD93D', correctPosition: 1, currentPosition: null as number | null },
                { id: 7, label: 'Porte', emoji: '🚪', color: '#4D96FF', correctPosition: 2, currentPosition: null as number | null },
                { id: 8, label: 'Fenêtre', emoji: '🪟', color: '#6BCB77', correctPosition: 3, currentPosition: null as number | null },
            ]
        },
        {
            id: 3, title: 'Puzzle Visage', description: 'Reconstituez un visage',
            pieces: [
                { id: 9, label: 'Yeux', emoji: '👀', color: '#4D96FF', correctPosition: 0, currentPosition: null as number | null },
                { id: 10, label: 'Nez', emoji: '👃', color: '#FFD93D', correctPosition: 1, currentPosition: null as number | null },
                { id: 11, label: 'Bouche', emoji: '👄', color: '#FF6B6B', correctPosition: 2, currentPosition: null as number | null },
                { id: 12, label: 'Oreilles', emoji: '👂', color: '#6BCB77', correctPosition: 3, currentPosition: null as number | null },
            ]
        },
        {
            id: 4, title: 'Puzzle Saisons', description: 'Ordonnez les saisons',
            pieces: [
                { id: 13, label: 'Printemps', emoji: '🌸', color: '#FFD93D', correctPosition: 0, currentPosition: null as number | null },
                { id: 14, label: 'Été', emoji: '☀️', color: '#FF6B6B', correctPosition: 1, currentPosition: null as number | null },
                { id: 15, label: 'Automne', emoji: '🍂', color: '#4D96FF', correctPosition: 2, currentPosition: null as number | null },
                { id: 16, label: 'Hiver', emoji: '❄️', color: '#6BCB77', correctPosition: 3, currentPosition: null as number | null },
            ]
        }
    ];

    currentPuzzle = computed(() => this.puzzles[this.activeStep()]);
    totalPuzzles = 4;
    progressPercentage = computed(() => Math.round((this.activeStep() / this.totalPuzzles) * 100));
    dropZones: (number | null)[] = [null, null, null, null];

    formattedTime = computed(() => {
        const m = Math.floor(this.elapsedSeconds() / 60);
        const s = this.elapsedSeconds() % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    });

    isCurrentPuzzleComplete = computed(() => this.dropZones.every(z => z !== null));
    currentScore = computed(() => this.activeStep());

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['patientId']) this.patientId.set(+params['patientId']);
            if (params['assignationId']) this.assignationId.set(+params['assignationId']);
            this.loadPatientInfo();
        });
        this.startTimer();
        this.shufflePieces();
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

    shufflePieces() { this.dropZones = [null, null, null, null]; }

    getAvailablePieces() {
        const placed = this.dropZones.filter(z => z !== null) as number[];
        return this.currentPuzzle().pieces.filter(p => !placed.includes(p.id));
    }

    getDropZonePiece(zoneIdx: number) {
        const pieceId = this.dropZones[zoneIdx];
        if (pieceId === null) return null;
        return this.currentPuzzle().pieces.find(p => p.id === pieceId) || null;
    }

    onDragStart(pieceId: number) { this.draggedPieceId.set(pieceId); }
    onDragOver(event: DragEvent) { event.preventDefault(); }

    onDropOnZone(event: DragEvent, zoneIdx: number) {
        event.preventDefault();
        const pieceId = this.draggedPieceId();
        if (pieceId === null) return;
        this.dropZones = this.dropZones.map(z => z === pieceId ? null : z);
        this.dropZones[zoneIdx] = pieceId;
        this.draggedPieceId.set(null);
    }

    onDropOnPool(event: DragEvent) {
        event.preventDefault();
        const pieceId = this.draggedPieceId();
        if (pieceId !== null) {
            this.dropZones = this.dropZones.map(z => z === pieceId ? null : z);
        }
        this.draggedPieceId.set(null);
    }

    isZoneCorrect(zoneIdx: number): boolean {
        const pieceId = this.dropZones[zoneIdx];
        if (pieceId === null) return false;
        const piece = this.currentPuzzle().pieces.find(p => p.id === pieceId);
        return piece?.correctPosition === zoneIdx;
    }

    goPrevPuzzle() {
        if (this.activeStep() > 0) {
            this.activeStep.update(s => s - 1);
            this.dropZones = [null, null, null, null];
        }
    }

    goNextPuzzle() {
        if (this.activeStep() < this.totalPuzzles - 1) {
            this.activeStep.update(s => s + 1);
            this.dropZones = [null, null, null, null];
        } else {
            this.finishTest();
        }
    }

    private finishTest() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        const score = this.dropZones.filter((z, idx) => this.isZoneCorrect(idx)).length;
        this.finalScore.set(score + (this.activeStep() * 4));
        this.isComplete.set(true);
        this.saveResults();
    }

    private saveResults() {
        const payload = { patientId: this.patientId(), testId: 17, assignationId: this.assignationId(), score: this.finalScore(), durationSeconds: this.elapsedSeconds() };
        this.http.post(`${this.apiUrl}/tests/17/results`, payload).subscribe({ error: () => { } });
    }

    returnToDashboard() { this.router.navigate(['/tests-cognitifs']); }
}
