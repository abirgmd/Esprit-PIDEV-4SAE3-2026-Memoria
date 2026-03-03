import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Question {
  id: number;
  text: string;
  answer: string;
  correctAnswer: string;
}

@Component({
  selector: 'app-diagnostic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diagnostic.component.html',
  styleUrl: './diagnostic.component.css'
})
export class DiagnosticComponent {
  currentQuestionIndex = 0;
  showModal = false;
  score = 0;
  mriImage: string | null = null;
  mriImageFile: File | null = null;

  questions: Question[] = [
    {
      id: 1,
      text: 'Name three objects I show you (e.g., pen, watch, key)',
      answer: '',
      correctAnswer: 'pen, watch, key'
    },
    {
      id: 2,
      text: 'What day of the week is it today?',
      answer: '',
      correctAnswer: 'current day'
    },
    {
      id: 3,
      text: 'Repeat the following phrase: "No ifs, ands, or buts"',
      answer: '',
      correctAnswer: 'no ifs, ands, or buts'
    },
    {
      id: 4,
      text: 'Count backwards from 100 by 7s (100, 93, 86...)',
      answer: '',
      correctAnswer: '100, 93, 86, 79, 72'
    },
    {
      id: 5,
      text: 'What is the name of the current president?',
      answer: '',
      correctAnswer: 'current president'
    },
    {
      id: 6,
      text: 'Name as many animals as you can in one minute',
      answer: '',
      correctAnswer: 'various animals'
    },
    {
      id: 7,
      text: 'Copy this drawing (intersecting pentagons)',
      answer: '',
      correctAnswer: 'drawing'
    },
    {
      id: 8,
      text: 'What were the three objects I asked you to remember?',
      answer: '',
      correctAnswer: 'pen, watch, key'
    },
    {
      id: 9,
      text: 'Write a complete sentence about the weather',
      answer: '',
      correctAnswer: 'complete sentence'
    },
    {
      id: 10,
      text: 'Follow this three-step command: Take this paper, fold it in half, and place it on the table',
      answer: '',
      correctAnswer: 'three steps completed'
    }
  ];

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    return Math.round((this.currentQuestionIndex / this.questions.length) * 100);
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get currentQuestionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.finishTest();
    }
  }

  finishTest(): void {
    this.calculateScore();
    this.showModal = true;
  }

  calculateScore(): void {
    let correctAnswers = 0;
    this.questions.forEach(question => {
      if (question.answer.trim().toLowerCase().includes(question.correctAnswer.toLowerCase().split(',')[0])) {
        correctAnswers++;
      }
    });
    this.score = Math.round((correctAnswers / this.questions.length) * 100);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.mriImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.mriImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  submitDiagnostic(): void {
    console.log('Diagnostic submitted with score:', this.score);
    console.log('MRI Image:', this.mriImageFile);
    this.closeModal();
  }
}
