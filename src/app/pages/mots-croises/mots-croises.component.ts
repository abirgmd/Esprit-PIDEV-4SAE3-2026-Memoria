import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Brain, Clock, ChevronRight, CheckCircle2, XCircle, Eraser, Send, ListChecks, HelpCircle, ChevronLeft } from 'lucide-angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TestResultService } from '../../services/test-result.service';
import { TestResult, SeverityLevel } from '../../models/cognitive-models';

interface CrosswordCell {
  x: number;
  y: number;
  letter: string;
  isBlocked: boolean; // Not used in a 5x5 full grid but good for future
  number?: number;
  horizontalWordId?: string;
  verticalWordId?: string;
}

interface CrosswordDefinition {
  id: string; // H1, V1, etc.
  number: number;
  direction: 'H' | 'V';
  length: number;
  clue: string;
  answer: string;
  startX: number;
  startY: number;
}

@Component({
  selector: 'app-mots-croises',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  templateUrl: './mots-croises.component.html',
  styleUrl: './mots-croises.component.css'
})
export class MotsCroisesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private testResultService = inject(TestResultService);

  readonly icons = {
    Brain, Clock, ChevronRight, CheckCircle2, XCircle, Eraser, Send, ListChecks, HelpCircle, ChevronLeft
  };

  assignmentId = signal<number | null>(null);
  currentPhase = signal<'INSTRUCTIONS' | 'PLAY' | 'VALIDATION' | 'RESULTS'>('INSTRUCTIONS');

  // Timer State
  totalTimeSeconds = 600; // 10 minutes
  timeLeftSeconds = signal(600);
  timerInterval: any;

  // Grid State
  gridSize = 5;
  grid = signal<CrosswordCell[][]>([]);
  selectedCell = signal<{ x: number, y: number } | null>(null);

  // Definitions based on requirement
  horizontalDefs: CrosswordDefinition[] = [
    { id: 'H1', number: 1, direction: 'H', length: 2, clue: 'Premier repas de la journée', answer: 'DÉ', startX: 0, startY: 0 },
    { id: 'H2', number: 2, direction: 'H', length: 4, clue: 'Animal qui aboie', answer: 'CHIEN', startX: 0, startY: 1 },
    { id: 'H3', number: 3, direction: 'H', length: 5, clue: 'On le boit chaud le matin', answer: 'CAFÉ', startX: 0, startY: 2 },
    { id: 'H4', number: 4, direction: 'H', length: 3, clue: 'Contraire de non', answer: 'OUI', startX: 0, startY: 3 },
    { id: 'H5', number: 5, direction: 'H', length: 4, clue: 'Il éclaire la pièce', answer: 'LAMPE', startX: 0, startY: 4 },
  ];

  verticalDefs: CrosswordDefinition[] = [
    { id: 'V1', number: 1, direction: 'V', length: 3, clue: 'Roi des animaux', answer: 'LION', startX: 0, startY: 0 },
    { id: 'V2', number: 2, direction: 'V', length: 5, clue: 'On y dort la nuit', answer: 'LIT', startX: 1, startY: 0 },
    { id: 'V3', number: 3, direction: 'V', length: 4, clue: 'Fruit rouge en été', answer: 'CERISE', startX: 2, startY: 0 },
    { id: 'V4', number: 4, direction: 'V', length: 3, clue: 'Métal précieux', answer: 'OR', startX: 3, startY: 0 },
    { id: 'V5', number: 5, direction: 'V', length: 4, clue: 'Page internet', answer: 'SITE', startX: 4, startY: 0 },
  ];

  // Scoring and Results
  results = signal<{ word: string, expected: string, user: string, isCorrect: boolean, score: number }[]>([]);
  totalScore = computed(() => this.results().reduce((acc, r) => acc + r.score, 0));
  maxScore = 10;
  timeSpentStr = '';

  constructor() {
    this.initGrid();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['assignationId'] || params['assignmentId'];
      if (id) {
        this.assignmentId.set(Number(id));
      }
      // We could also store testId and patientId if needed for further logic
    });
  }

  initGrid() {
    const newGrid: CrosswordCell[][] = [];
    for (let y = 0; y < this.gridSize; y++) {
      const row: CrosswordCell[] = [];
      for (let x = 0; x < this.gridSize; x++) {
        row.push({
          x, y,
          letter: '',
          isBlocked: false,
          number: this.getNumberForCell(x, y)
        });
      }
      newGrid.push(row);
    }
    this.grid.set(newGrid);
  }

  getNumberForCell(x: number, y: number): number | undefined {
    // Numbers appear at the start of words
    const h = this.horizontalDefs.find(d => d.startX === x && d.startY === y);
    const v = this.verticalDefs.find(d => d.startX === x && d.startY === y);
    return h?.number || v?.number;
  }

  startTest() {
    this.currentPhase.set('PLAY');
    this.startTimer();
    // Default selection
    this.selectedCell.set({ x: 0, y: 0 });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeftSeconds.update(v => {
        if (v <= 1) {
          this.finishTest();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onCellClick(x: number, y: number) {
    this.selectedCell.set({ x, y });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.currentPhase() !== 'PLAY') return;

    const current = this.selectedCell();
    if (!current) return;

    const { x, y } = current;

    if (event.key.length === 1 && /[a-zA-Zàâäéèêëïîôöùûüç]/.test(event.key)) {
      this.updateCell(x, y, event.key.toUpperCase());
      this.moveNext(x, y);
    } else if (event.key === 'Backspace') {
      this.updateCell(x, y, '');
      this.movePrev(x, y);
    } else if (event.key === 'ArrowRight') {
      this.selectedCell.set({ x: Math.min(this.gridSize - 1, x + 1), y });
    } else if (event.key === 'ArrowLeft') {
      this.selectedCell.set({ x: Math.max(0, x - 1), y });
    } else if (event.key === 'ArrowDown') {
      this.selectedCell.set({ x, y: Math.min(this.gridSize - 1, y + 1) });
    } else if (event.key === 'ArrowUp') {
      this.selectedCell.set({ x: x, y: Math.max(0, y - 1) });
    }
  }

  updateCell(x: number, y: number, letter: string) {
    const newGrid = [...this.grid()];
    newGrid[y][x].letter = letter;
    this.grid.set(newGrid);
  }

  moveNext(x: number, y: number) {
    if (x < this.gridSize - 1) {
      this.selectedCell.set({ x: x + 1, y });
    } else if (y < this.gridSize - 1) {
      this.selectedCell.set({ x: 0, y: y + 1 });
    }
  }

  movePrev(x: number, y: number) {
    if (x > 0) {
      this.selectedCell.set({ x: x - 1, y });
    } else if (y > 0) {
      this.selectedCell.set({ x: this.gridSize - 1, y: y - 1 });
    }
  }

  clearGrid() {
    if (confirm('Êtes-vous sûr de vouloir effacer toute la grille ?')) {
      this.initGrid();
    }
  }

  validatePrompt() {
    this.currentPhase.set('VALIDATION');
  }

  cancelValidation() {
    this.currentPhase.set('PLAY');
  }

  finishTest() {
    clearInterval(this.timerInterval);
    const timeSpent = this.totalTimeSeconds - this.timeLeftSeconds();
    this.timeSpentStr = `${Math.floor(timeSpent / 60)} min ${timeSpent % 60} sec`;

    this.calculateResults();
    this.saveResult();
    this.currentPhase.set('RESULTS');
  }

  calculateResults() {
    const finalResults: any[] = [];
    const gridData = this.grid();

    // Check Horizontal
    this.horizontalDefs.forEach(def => {
      let userWord = '';
      for (let i = 0; i < def.length; i++) {
        userWord += gridData[def.startY][def.startX + i].letter;
      }
      finalResults.push({
        id: def.id,
        expected: def.answer,
        user: userWord,
        isCorrect: userWord === def.answer,
        score: userWord === def.answer ? 1 : 0
      });
    });

    // Check Vertical
    this.verticalDefs.forEach(def => {
      let userWord = '';
      for (let i = 0; i < def.length; i++) {
        userWord += gridData[def.startY + i][def.startX].letter;
      }
      finalResults.push({
        id: def.id,
        expected: def.answer,
        user: userWord,
        isCorrect: userWord === def.answer,
        score: userWord === def.answer ? 1 : 0
      });
    });

    this.results.set(finalResults);
  }

  saveResult() {
    const patientId = Number(localStorage.getItem('patientId')) || 36; // Default demo patient
    const result: TestResult = {
      patientId: patientId,
      assignmentId: this.assignmentId() || undefined,
      scoreTotale: this.totalScore(),
      maxPossibleScore: this.maxScore,
      scorePercentage: (this.totalScore() / this.maxScore) * 100,
      testDate: new Date().toISOString(),
      durationSeconds: this.totalTimeSeconds - this.timeLeftSeconds(),
      isValid: true,
      severityLevel: this.totalScore() >= 8 ? SeverityLevel.NORMAL : (this.totalScore() >= 5 ? SeverityLevel.MILD : SeverityLevel.SEVERE)
    };

    this.testResultService.create(result).subscribe({
      next: (res) => console.log('Result saved:', res),
      error: (err) => console.error('Error saving result:', err)
    });
  }

  getFilledCount() {
    return this.grid().flat().filter(c => c.letter !== '').length;
  }

  exit() {
    this.router.navigate(['/tests-cognitifs']);
  }
}
