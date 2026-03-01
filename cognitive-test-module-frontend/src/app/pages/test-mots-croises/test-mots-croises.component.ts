import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CrosswordTestService, CrosswordAnswerDto, CrosswordResultDto } from '../../services/crossword-test.service';

interface WordDefinition {
  id: string;
  number: number;
  direction: 'H' | 'V';
  length: number;
  definition: string;
  answer: string;
  startRow: number;
  startCol: number;
}

interface GridCell {
  letter: string;
  wordIds: string[];
  userInput: string;
  isCorrect?: boolean;
  isBlocked: boolean;
}

interface TestResult {
  resultId?: number;
  patientId: number;
  testId: number;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  responses: Array<{
    wordId: string;
    answer: string;
    userInput: string;
    isCorrect: boolean;
  }>;
}

@Component({
  selector: 'app-test-mots-croises',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-mots-croises.component.html',
  styleUrls: ['./test-mots-croises.component.css']
})
export class TestMotsCroisesComponent implements OnInit {
  // Test state
  testPhase = signal<'presentation' | 'playing' | 'validation' | 'results'>('presentation');
  currentPatientId = signal<number>(0);
  currentTestId = signal<number>(6); // ID 6 pour mots croisés
  
  // Grid state
  gridSize = 5;
  grid = signal<GridCell[][]>([]);
  selectedCell = signal<{row: number, col: number} | null>(null);
  currentDirection = signal<'H' | 'V'>('H');
  
  // Words and definitions
  words = signal<WordDefinition[]>([]);
  horizontalWords = computed(() => this.words().filter(w => w.direction === 'H'));
  verticalWords = computed(() => this.words().filter(w => w.direction === 'V'));
  
  // Timer
  timeRemaining = signal<number>(600); // 10 minutes in seconds
  timerInterval: any = null;
  startTime: number = 0;
  
  // Results
  score = signal<number>(0);
  testResults = signal<TestResult | null>(null);
  
  // API
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private crosswordTestService: CrosswordTestService
  ) {}

  ngOnInit(): void {
    // Get patient and test IDs from route
    this.route.params.subscribe(params => {
      this.currentPatientId.set(+params['patientId'] || 1);
      this.currentTestId.set(+params['testId'] || 6);
    });

    // Initialize test
    this.initializeTest();
  }

  initializeTest(): void {
    this.loadWordsData();
    this.initializeGrid();
  }

  loadWordsData(): void {
    // Load words data - in real app, this would come from backend
    const mockWords: WordDefinition[] = [
      // Horizontal words
      {
        id: 'H1',
        number: 1,
        direction: 'H',
        length: 2,
        definition: 'Premier repas de la journée',
        answer: 'DE',
        startRow: 0,
        startCol: 0
      },
      {
        id: 'H2',
        number: 2,
        direction: 'H',
        length: 5,
        definition: 'Animal qui aboie',
        answer: 'CHIEN',
        startRow: 1,
        startCol: 0
      },
      {
        id: 'H3',
        number: 3,
        direction: 'H',
        length: 5,
        definition: 'On le boit chaud le matin',
        answer: 'CAFE',
        startRow: 2,
        startCol: 0
      },
      {
        id: 'H4',
        number: 4,
        direction: 'H',
        length: 3,
        definition: 'Contraire de non',
        answer: 'OUI',
        startRow: 3,
        startCol: 0
      },
      {
        id: 'H5',
        number: 5,
        direction: 'H',
        length: 5,
        definition: 'Il éclaire la pièce',
        answer: 'LAMPE',
        startRow: 4,
        startCol: 0
      },
      // Vertical words
      {
        id: 'V1',
        number: 1,
        direction: 'V',
        length: 4,
        definition: 'Roi des animaux',
        answer: 'LION',
        startRow: 0,
        startCol: 0
      },
      {
        id: 'V2',
        number: 2,
        direction: 'V',
        length: 3,
        definition: 'On y dort la nuit',
        answer: 'LIT',
        startRow: 0,
        startCol: 1
      },
      {
        id: 'V3',
        number: 3,
        direction: 'V',
        length: 6,
        definition: 'Fruit rouge en été',
        answer: 'CERISE',
        startRow: 0,
        startCol: 2
      },
      {
        id: 'V4',
        number: 4,
        direction: 'V',
        length: 2,
        definition: 'Métal précieux',
        answer: 'OR',
        startRow: 0,
        startCol: 3
      },
      {
        id: 'V5',
        number: 5,
        direction: 'V',
        length: 4,
        definition: 'Page internet',
        answer: 'SITE',
        startRow: 0,
        startCol: 4
      }
    ];

    this.words.set(mockWords);
  }

  initializeGrid(): void {
    const newGrid: GridCell[][] = [];
    
    // Initialize empty grid
    for (let i = 0; i < this.gridSize; i++) {
      newGrid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        newGrid[i][j] = {
          letter: '',
          wordIds: [],
          userInput: '',
          isBlocked: true
        };
      }
    }

    // Place words on grid
    this.words().forEach(word => {
      for (let i = 0; i < word.answer.length; i++) {
        const row = word.direction === 'H' ? word.startRow : word.startRow + i;
        const col = word.direction === 'H' ? word.startCol + i : word.startCol;
        
        if (row < this.gridSize && col < this.gridSize) {
          newGrid[row][col].letter = word.answer[i];
          newGrid[row][col].wordIds.push(word.id);
          newGrid[row][col].isBlocked = false;
        }
      }
    });

    this.grid.set(newGrid);
  }

  startTest(): void {
    this.testPhase.set('playing');
    this.startTime = Date.now();
    this.startTimer();
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      const remaining = this.timeRemaining() - 1;
      this.timeRemaining.set(remaining);
      
      if (remaining <= 0) {
        this.completeTest();
      }
    }, 1000);
  }

  completeTest(): void {
    this.testPhase.set('results');
    this.calculateResults();
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  selectCell(row: number, col: number): void {
    if (this.grid()[row][col].isBlocked) return;
    
    this.selectedCell.set({ row, col });
    
    // Determine direction based on current selection
    if (this.selectedCell()) {
      const cell = this.grid()[row][col];
      if (cell.wordIds.length > 0) {
        // If cell has multiple words, toggle direction
        if (cell.wordIds.length > 1) {
          this.currentDirection.set(this.currentDirection() === 'H' ? 'V' : 'H');
        }
      }
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.selectedCell() || this.testPhase() !== 'playing') return;

    const { row, col } = this.selectedCell()!;
    const key = event.key.toUpperCase();

    // Handle letter input
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      this.grid()[row][col].userInput = key;
      this.moveToNextCell();
      event.preventDefault();
    }
    
    // Handle navigation
    switch (event.key) {
      case 'ArrowUp':
        this.moveSelection(-1, 0);
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.moveSelection(1, 0);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.moveSelection(0, -1);
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.moveSelection(0, 1);
        event.preventDefault();
        break;
      case 'Backspace':
        this.grid()[row][col].userInput = '';
        this.moveToPreviousCell();
        event.preventDefault();
        break;
    }
  }

  moveSelection(dRow: number, dCol: number): void {
    if (!this.selectedCell()) return;
    
    const { row, col } = this.selectedCell()!;
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    if (newRow >= 0 && newRow < this.gridSize && 
        newCol >= 0 && newCol < this.gridSize && 
        !this.grid()[newRow][newCol].isBlocked) {
      this.selectedCell.set({ row: newRow, col: newCol });
    }
  }

  moveToNextCell(): void {
    if (!this.selectedCell()) return;
    
    const { row, col } = this.selectedCell()!;
    const direction = this.currentDirection();
    
    if (direction === 'H') {
      this.moveSelection(0, 1);
    } else {
      this.moveSelection(1, 0);
    }
  }

  moveToPreviousCell(): void {
    if (!this.selectedCell()) return;
    
    const { row, col } = this.selectedCell()!;
    const direction = this.currentDirection();
    
    if (direction === 'H') {
      this.moveSelection(0, -1);
    } else {
      this.moveSelection(-1, 0);
    }
  }

  clearGrid(): void {
    const newGrid = this.grid().map(row => 
      row.map(cell => ({ ...cell, userInput: '' }))
    );
    this.grid.set(newGrid);
  }

  showValidation(): void {
    this.testPhase.set('validation');
  }

  validateAnswers(): void {
    this.testPhase.set('results');
    this.calculateResults();
  }

  calculateResults(): void {
    const responses: TestResult['responses'] = [];
    let correctCount = 0;

    this.words().forEach(word => {
      let userInput = '';
      
      // Get user input for this word
      for (let i = 0; i < word.answer.length; i++) {
        const row = word.direction === 'H' ? word.startRow : word.startRow + i;
        const col = word.direction === 'H' ? word.startCol + i : word.startCol;
        
        if (row < this.gridSize && col < this.gridSize) {
          userInput += this.grid()[row][col].userInput || '';
        }
      }

      const isCorrect = userInput === word.answer;
      if (isCorrect) correctCount++;

      responses.push({
        wordId: word.id,
        answer: word.answer,
        userInput,
        isCorrect
      });
    });

    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
    this.score.set(correctCount);

    const result: TestResult = {
      patientId: this.currentPatientId(),
      testId: this.currentTestId(),
      score: correctCount,
      totalQuestions: this.words().length,
      timeTaken,
      responses
    };

    this.testResults.set(result);
    this.saveResults(result);
  }

  saveResults(result: TestResult): void {
    // Convert TestResult to CrosswordResultDto
    const crosswordResult: CrosswordResultDto = {
      testId: this.currentTestId(),
      patientId: this.currentPatientId(),
      score: result.score,
      totalQuestions: result.totalQuestions,
      completedAt: new Date(),
      answers: result.responses.map(resp => ({
        questionId: parseInt(resp.wordId),
        answer: resp.userInput,
        patientId: this.currentPatientId(),
        testId: this.currentTestId()
      }))
    };

    this.crosswordTestService.submitTest(crosswordResult).subscribe({
      next: (response) => {
        console.log('Crossword test results saved:', response);
        this.testResults.set({
          ...result,
          resultId: response.resultId
        });
      },
      error: (err) => {
        console.error('Error saving crossword results:', err);
      }
    });
  }

  saveSingleAnswer(wordId: string, answer: string): void {
    const crosswordAnswer: CrosswordAnswerDto = {
      questionId: parseInt(wordId),
      answer: answer,
      patientId: this.currentPatientId(),
      testId: this.currentTestId()
    };

    this.crosswordTestService.saveAnswer(crosswordAnswer).subscribe({
      next: (response) => {
        console.log('Answer saved:', response);
      },
      error: (err) => {
        console.error('Error saving answer:', err);
      }
    });
  }

  restartTest(): void {
    // Reset all state
    this.testPhase.set('presentation');
    this.timeRemaining.set(600);
    this.score.set(0);
    this.testResults.set(null);
    this.selectedCell.set(null);
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    this.initializeTest();
  }

  returnToTests(): void {
    this.router.navigate(['/tests-cognitifs']);
  }

  getFilledCellsCount(): number {
    let count = 0;
    this.grid().forEach(row => {
      row.forEach(cell => {
        if (!cell.isBlocked && cell.userInput) {
          count++;
        }
      });
    });
    return count;
  }

  getWordNumber(wordId: string): number {
    const word = this.words().find(w => w.id === wordId);
    return word ? word.number : 0;
  }

  getWordById(wordId: string): WordDefinition | undefined {
    return this.words().find(w => w.id === wordId);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
