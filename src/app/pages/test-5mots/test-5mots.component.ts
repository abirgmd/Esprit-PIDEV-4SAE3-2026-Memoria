import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Mot5Word {
  id: number;
  word: string;
  category: string;
  orderIndex: number;
  rappelLibre?: boolean;
  rappelIndice?: boolean;
  score?: number;
  userAnswer?: string;
}

interface TestState {
  mots5TestId: number;
  currentPhase: 'ENCODAGE' | 'RAPPEL_IMMEDIAT' | 'DISTRACTEUR' | 'RAPPEL_LIBRE' | 'RAPPEL_INDICE' | 'TERMINE';
  mots: Mot5Word[];
  timer: { actif: boolean; tempsRestant: number };
  completed: boolean;
}

interface TestResult {
  word: string;
  category: string;
  rappelLibre: boolean;
  rappelIndice: boolean;
  score: number;
  rappelLibreReponse?: string;
  rappelIndiceReponse?: string;
}

@Component({
  selector: 'app-test-5mots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="test-5mots-container">
      <!-- Header with Progress -->
      <div class="test-header">
        <div class="header-title">
          <h1 class="test-title">TEST DES 5 MOTS</h1>
          <div class="progress-indicator">
            <span class="progress-dot" [class.active]="currentPhaseIndex() >= 1">●</span>
            <span class="progress-dot" [class.active]="currentPhaseIndex() >= 2">●</span>
            <span class="progress-dot" [class.active]="currentPhaseIndex() >= 3">●</span>
            <span class="progress-dot" [class.active]="currentPhaseIndex() >= 4">●</span>
            <span class="progress-dot" [class.active]="currentPhaseIndex() >= 5">●</span>
          </div>
        </div>
        <div class="phase-info">
          <span class="phase-name">{{ currentPhaseLabel() }}</span>
          <span class="phase-number">Phase {{ currentPhaseIndex() }}/5</span>
        </div>
      </div>

      @switch (testState().currentPhase) {
        <!-- PHASE 1: ENCODAGE -->
        @case ('ENCODAGE') {
          <div class="phase-container encodage">
            <div class="word-display-card">
              <div class="word-text">{{ currentEncodageWord()?.word }}</div>
              <div class="word-category">► C'est {{ currentEncodageWord()?.category }}</div>
            </div>
            
            <div class="instruction">
              Lisez le mot et sa catégorie.
            </div>

            <div class="word-counter">
              Mot {{ currentEncodageIndex() + 1 }} / {{ testState().mots.length }}
            </div>

            <button class="btn-primary" (click)="nextEncodageWord()">
              {{ isLastEncodageWord() ? 'Phase suivante' : 'SUIVANT →' }}
            </button>
          </div>
        }

        <!-- PHASE 2: RAPPEL IMMEDIAT -->
        @case ('RAPPEL_IMMEDIAT') {
          <div class="phase-container rappel-immediat">
            <div class="instruction-large">
              "Écrivez les 5 mots que vous venez de voir"
            </div>
            
            <div class="answers-grid">
              @for (mot of testState().mots; track mot.id; let idx = $index) {
                <div class="answer-field">
                  <span class="field-label">Mot {{ idx + 1 }} :</span>
                  <input 
                    type="text" 
                    [(ngModel)]="rappelImmediatAnswers[idx]"
                    class="answer-input"
                    placeholder="_________________________">
                </div>
              }
            </div>

            <div class="navigation-buttons">
              <button class="btn-secondary" (click)="returnToDashboard()">← RETOUR</button>
              <button 
                class="btn-primary" 
                (click)="submitRappelImmediat()"
                [disabled]="!canSubmitRappelImmediat()">
                VALIDER
              </button>
            </div>
          </div>
        }

        <!-- PHASE 3: DISTRACTEUR -->
        @case ('DISTRACTEUR') {
          <div class="phase-container distracteur">
            <div class="instruction-large">
              Comptez à rebours à partir de 100
            </div>
            
            <div class="timer-section">
              <div class="timer-display">
                <span class="timer-icon">⏱️</span>
                <span class="timer-label">TEMPS RESTANT :</span>
                <span class="timer-value">{{ formattedDistracteurTime() }}</span>
              </div>
              
              <div class="progress-bar-container">
                <div class="progress-bar" [style.width.%]="distracteurProgress()"></div>
              </div>
              
              <div class="progress-percentage">{{ distracteurProgress() }}%</div>
            </div>

            <div class="counting-instruction">
              <div class="counting-box">
                <div class="counting-title">Comptez à rebours silencieusement</div>
                <div class="counting-example">100... 99... 98... 97...</div>
              </div>
            </div>

            <div class="warning">
              ⚠️ Ne pas essayer de se souvenir des mots
            </div>

            @if (distracteurTimeRemaining() <= 0) {
              <div class="completion-message">
                <div class="completion-title">⏰ TEMPS ÉCOULÉ ! ⏰</div>
                <div class="completion-text">La phase de distraction est terminée.</div>
                <button class="btn-primary" (click)="finishDistracteur()">PHASE SUIVANTE →</button>
              </div>
            }
          </div>
        }

        <!-- PHASE 4: RAPPEL LIBRE -->
        @case ('RAPPEL_LIBRE') {
          <div class="phase-container rappel-libre">
            <div class="instruction-large">
              "Écrivez tous les mots dont vous vous souvenez de la phase d'apprentissage"
            </div>
            
            <div class="answers-grid">
              @for (mot of testState().mots; track mot.id; let idx = $index) {
                <div class="answer-field">
                  <span class="field-label">▢ Mot {{ idx + 1 }} :</span>
                  <input 
                    type="text" 
                    [(ngModel)]="rappelLibreAnswers[idx]"
                    class="answer-input"
                    placeholder="_________________________">
                </div>
              }
            </div>

            <div class="tip">
              💡 Astuce : Laissez vide si vous ne vous souvenez pas de tous les mots
            </div>

            <div class="navigation-buttons">
              <button class="btn-secondary" (click)="returnToDashboard()">← RETOUR</button>
              <button 
                class="btn-primary" 
                (click)="submitRappelLibre()"
                [disabled]="!canSubmitRappelLibre()">
                VALIDER
              </button>
            </div>
          </div>
        }

        <!-- PHASE 5: RAPPEL INDICE -->
        @case ('RAPPEL_INDICE') {
          <div class="phase-container rappel-indice">
            <div class="instruction-large">
              "Je vais vous donner des indices pour les mots que vous n'avez pas trouvés"
            </div>

            <div class="summary-info">
              <div class="summary-item">
                <span class="summary-label">Mots déjà rappelés :</span>
                <span class="summary-value">{{ motsAlreadyRecalled() }}/5</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Mots à retrouver avec indice :</span>
                <span class="summary-value">{{ motsForIndice().length }}</span>
              </div>
            </div>

            @if (motsForIndice().length === 0) {
              <div class="all-found-message">
                <span class="success-icon">✅</span>
                <div class="success-text">TEST TERMINÉ</div>
                <div class="success-subtitle">Vous avez complété les 5 phases du test.</div>
                <button class="btn-primary" (click)="finishTest()">VOIR LES RÉSULTATS</button>
              </div>
            } @else {
              <div class="indice-list">
                @for (mot of motsForIndice(); track mot.id; let idx = $index) {
                  <div class="indice-card">
                    <div class="indice-header">
                      Mot à retrouver ({{ idx + 1 }}/{{ motsForIndice().length }})
                    </div>
                    <div class="indice-content">
                      <div class="indice-text">INDICE : C'est {{ mot.category }}</div>
                      <input 
                        type="text" 
                        [(ngModel)]="rappelIndiceAnswers[mot.id]"
                        class="answer-input"
                        placeholder="___________________________">
                    </div>
                  </div>
                }
              </div>

              <div class="navigation-buttons">
                <button class="btn-secondary" (click)="skipIndice()">PASSER CET INDICE</button>
                <button class="btn-primary" (click)="submitRappelIndice()">VALIDER</button>
              </div>
            }
          </div>
        }

        <!-- PHASE 6: RESULTATS -->
        @case ('TERMINE') {
          <div class="phase-container resultats">
            <div class="results-header">
              <h2 class="results-title">RÉSULTATS DU TEST DES 5 MOTS</h2>
            </div>

            <div class="patient-info">
              <div class="info-row">
                <span class="info-label">PATIENT :</span>
                <span class="info-value">Jean DUPONT</span>
              </div>
              <div class="info-row">
                <span class="info-label">DATE :</span>
                <span class="info-value">{{ todayDate() }}</span>
              </div>
            </div>

            <div class="score-summary">
              <div class="score-box">
                <div class="score-title">SCORE TOTAL :</div>
                <div class="score-value">{{ totalScore() }} / 10</div>
                <div class="score-interpretation">{{ interpretation() }}</div>
              </div>
            </div>

            <div class="results-table-section">
              <h3 class="table-title">DÉTAIL DES RÉPONSES</h3>
              <table class="results-table">
                <thead>
                  <tr>
                    <th>MOT</th>
                    <th>RAPPEL LIBRE</th>
                    <th>RAPPEL INDICÉ</th>
                    <th>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  @for (result of testResults(); track result.word) {
                    <tr>
                      <td class="word-cell">
                        <div class="word-main">{{ result.word }}</div>
                        <div class="word-category">{{ result.category }}</div>
                      </td>
                      <td class="recall-cell">
                        @if (result.rappelLibre) {
                          <span class="check-mark">✓</span>
                        } @else {
                          <span class="dash">-</span>
                        }
                        @if (result.rappelLibreReponse) {
                          <div class="response-text">({{ result.rappelLibreReponse }})</div>
                        }
                      </td>
                      <td class="recall-cell">
                        @if (result.rappelIndice) {
                          <span class="check-mark">✓</span>
                        } @else {
                          <span class="dash">-</span>
                        }
                        @if (result.rappelIndiceReponse) {
                          <div class="response-text">({{ result.rappelIndiceReponse }})</div>
                        }
                      </td>
                      <td class="score-cell">
                        <span class="score-badge" [class.score-2]="result.score === 2" [class.score-1]="result.score === 1" [class.score-0]="result.score === 0">
                          {{ result.score }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="scoring-legend">
              <h3>LÉGENDE DES SCORES</h3>
              <div class="legend-items">
                <div class="legend-item">
                  <span class="score-badge score-2">2</span>
                  <span>Rappel libre (sans indice)</span>
                </div>
                <div class="legend-item">
                  <span class="score-badge score-1">1</span>
                  <span>Rappel indicé (avec catégorie)</span>
                </div>
                <div class="legend-item">
                  <span class="score-badge score-0">0</span>
                  <span>Non rappelé</span>
                </div>
              </div>
            </div>

            <div class="results-actions">
              <button class="btn-secondary">TÉLÉCHARGER PDF</button>
              <button class="btn-primary" (click)="returnToDashboard()">NOUVEAU TEST</button>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .test-5mots-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 2px solid #e5e7eb;
    }

    /* Header with Progress */
    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .header-title {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .test-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .progress-indicator {
      display: flex;
      gap: 8px;
    }

    .progress-dot {
      font-size: 18px;
      color: #d1d5db;
      transition: color 0.3s ease;
    }

    .progress-dot.active {
      color: #a78bfa;
    }

    .phase-info {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .phase-name {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .phase-number {
      font-size: 12px;
      color: #6b7280;
    }

    /* Phase Container */
    .phase-container {
      text-align: center;
      min-height: 400px;
    }

    /* Instructions */
    .instruction-large {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 32px 0;
      line-height: 1.4;
    }

    .instruction {
      font-size: 18px;
      color: #374151;
      margin: 0 0 24px 0;
      font-weight: 500;
    }

    /* Encodage Phase */
    .word-display-card {
      background: #f8fafc;
      border: 3px solid #a78bfa;
      border-radius: 16px;
      padding: 48px 32px;
      margin: 32px 0;
      box-shadow: 0 4px 12px rgba(167, 139, 250, 0.15);
    }

    .word-text {
      font-size: 48px;
      font-weight: 700;
      color: #7c3aed;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 3px;
      line-height: 1.2;
    }

    .word-category {
      font-size: 20px;
      color: #374151;
      font-weight: 600;
    }

    .word-counter {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 32px;
      font-weight: 500;
    }

    /* Answer Grid */
    .answers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 32px 0;
    }

    .answer-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: left;
    }

    .field-label {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .answer-input {
      padding: 16px 20px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 18px;
      transition: border-color 0.2s ease;
      font-family: inherit;
    }

    .answer-input:focus {
      outline: none;
      border-color: #a78bfa;
      box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
    }

    /* Navigation Buttons */
    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      gap: 16px;
    }

    /* Buttons */
    .btn-primary {
      padding: 16px 32px;
      border: none;
      border-radius: 12px;
      background: #a78bfa;
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 150px;
    }

    .btn-primary:hover:not(:disabled) {
      background: #8b5cf6;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(167, 139, 250, 0.25);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn-secondary {
      padding: 16px 24px;
      border: 2px solid #d1d5db;
      border-radius: 12px;
      background: #ffffff;
      color: #374151;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 150px;
    }

    .btn-secondary:hover {
      border-color: #9ca3af;
      background: #f9fafb;
    }

    /* Distracteur Phase */
    .timer-section {
      background: #f8fafc;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      padding: 32px;
      margin: 32px 0;
    }

    .timer-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .timer-icon {
      font-size: 32px;
    }

    .timer-label {
      font-size: 18px;
      font-weight: 600;
      color: #374151;
    }

    .timer-value {
      font-size: 32px;
      font-weight: 700;
      color: #7c3aed;
      font-variant-numeric: tabular-nums;
    }

    .progress-bar-container {
      width: 100%;
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #a78bfa, #8b5cf6);
      border-radius: 6px;
      transition: width 1s linear;
    }

    .progress-percentage {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .counting-instruction {
      margin: 32px 0;
    }

    .counting-box {
      background: #f3f4f6;
      border: 2px solid #d1d5db;
      border-radius: 12px;
      padding: 24px;
    }

    .counting-title {
      font-size: 18px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
    }

    .counting-example {
      font-family: monospace;
      font-size: 20px;
      color: #6b7280;
      font-weight: 500;
    }

    .warning {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 12px;
      padding: 16px 24px;
      margin: 24px 0;
      font-size: 16px;
      font-weight: 600;
      color: #92400e;
    }

    .completion-message {
      background: #f0fdf4;
      border: 2px solid #22c55e;
      border-radius: 16px;
      padding: 32px;
      margin: 32px 0;
    }

    .completion-title {
      font-size: 24px;
      font-weight: 700;
      color: #16a34a;
      margin-bottom: 12px;
    }

    .completion-text {
      font-size: 18px;
      color: #374151;
      margin-bottom: 24px;
    }

    /* Rappel Indice */
    .summary-info {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin: 24px 0;
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    .summary-value {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }

    .indice-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin: 32px 0;
    }

    .indice-card {
      background: #f8fafc;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
      text-align: left;
    }

    .indice-header {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
    }

    .indice-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .indice-text {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }

    .all-found-message {
      background: #f0fdf4;
      border: 2px solid #22c55e;
      border-radius: 16px;
      padding: 48px 32px;
      margin: 32px 0;
      text-align: center;
    }

    .success-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 16px;
    }

    .success-text {
      font-size: 24px;
      font-weight: 700;
      color: #16a34a;
      margin-bottom: 8px;
    }

    .success-subtitle {
      font-size: 16px;
      color: #374151;
      margin-bottom: 24px;
    }

    .tip {
      background: #eff6ff;
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 16px 24px;
      margin: 24px 0;
      font-size: 16px;
      color: #1e40af;
    }

    /* Results */
    .results-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .results-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .patient-info {
      background: #f8fafc;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-around;
    }

    .info-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .score-summary {
      text-align: center;
      margin-bottom: 32px;
    }

    .score-box {
      background: #f8fafc;
      border: 3px solid #a78bfa;
      border-radius: 16px;
      padding: 32px;
      display: inline-block;
      min-width: 250px;
    }

    .score-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
    }

    .score-value {
      font-size: 36px;
      font-weight: 700;
      color: #7c3aed;
      margin-bottom: 12px;
    }

    .score-interpretation {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .results-table-section {
      margin-bottom: 32px;
    }

    .table-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px 0;
      text-align: center;
    }

    .results-table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .results-table th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e5e7eb;
    }

    .results-table td {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }

    .word-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .word-main {
      font-weight: 700;
      color: #111827;
      font-size: 16px;
    }

    .word-category {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
    }

    .recall-cell {
      text-align: center;
    }

    .check-mark {
      color: #22c55e;
      font-weight: 700;
      font-size: 18px;
    }

    .dash {
      color: #9ca3af;
      font-size: 18px;
    }

    .response-text {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
      font-style: italic;
    }

    .score-cell {
      text-align: center;
    }

    .score-badge {
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      color: white;
    }

    .score-badge.score-2 {
      background: #22c55e;
    }

    .score-badge.score-1 {
      background: #f59e0b;
    }

    .score-badge.score-0 {
      background: #ef4444;
    }

    .scoring-legend {
      background: #f8fafc;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }

    .scoring-legend h3 {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 16px 0;
      text-align: center;
    }

    .legend-items {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6b7280;
    }

    .results-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .test-5mots-container {
        padding: 16px;
        margin: 16px;
      }

      .test-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .phase-info {
        text-align: center;
      }

      .word-text {
        font-size: 36px;
      }

      .answers-grid {
        grid-template-columns: 1fr;
      }

      .navigation-buttons {
        flex-direction: column;
        gap: 12px;
      }

      .summary-info {
        flex-direction: column;
        gap: 16px;
      }

      .patient-info {
        flex-direction: column;
        gap: 16px;
      }

      .legend-items {
        flex-direction: column;
        gap: 12px;
      }

      .results-actions {
        flex-direction: column;
      }
    }
  `]
})
export class Test5MotsComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  // Test State
  testState = signal<TestState>({
    mots5TestId: 0,
    currentPhase: 'ENCODAGE',
    mots: [],
    timer: { actif: false, tempsRestant: 180 },
    completed: false
  });

  // Encodage
  currentEncodageIndex = signal<number>(0);

  // Rappel Immédiat
  rappelImmediatAnswers: string[] = [];

  // Distracteur
  distracteurTimeRemaining = signal<number>(180);
  private distracteurInterval: any;

  // Rappel Libre
  rappelLibreAnswers: string[] = [];

  // Rappel Indice
  rappelIndiceAnswers: { [key: number]: string } = {};

  // Results
  testResults = signal<TestResult[]>([]);
  totalScore = signal<number>(0);

  ngOnInit(): void {
    const testId = this.route.snapshot.queryParamMap.get('testId');
    const patientId = this.route.snapshot.queryParamMap.get('patientId');
    const assignationId = this.route.snapshot.queryParamMap.get('assignationId');

    if (testId && patientId) {
      this.loadTestData(parseInt(testId), parseInt(patientId), assignationId ? parseInt(assignationId) : undefined);
    }
  }

  ngOnDestroy(): void {
    if (this.distracteurInterval) {
      clearInterval(this.distracteurInterval);
    }
  }

  // Computed
  currentPhaseLabel = computed(() => {
    const labels: { [key: string]: string } = {
      'ENCODAGE': 'Encodage',
      'RAPPEL_IMMEDIAT': 'Rappel Immédiat',
      'DISTRACTEUR': 'Tâche Distractrice',
      'RAPPEL_LIBRE': 'Rappel Libre',
      'RAPPEL_INDICE': 'Rappel Indicé',
      'TERMINE': 'Résultats'
    };
    return labels[this.testState().currentPhase] || this.testState().currentPhase;
  });

  currentPhaseIndex = computed(() => {
    const phases = ['ENCODAGE', 'RAPPEL_IMMEDIAT', 'DISTRACTEUR', 'RAPPEL_LIBRE', 'RAPPEL_INDICE'];
    return phases.indexOf(this.testState().currentPhase) + 1;
  });

  progressPercentage = computed(() => {
    const phaseIndex = this.currentPhaseIndex();
    return (phaseIndex / 5) * 100;
  });

  currentEncodageWord = computed(() => {
    return this.testState().mots[this.currentEncodageIndex()] || null;
  });

  isLastEncodageWord = computed(() => {
    return this.currentEncodageIndex() === this.testState().mots.length - 1;
  });

  formattedDistracteurTime = computed(() => {
    const minutes = Math.floor(this.distracteurTimeRemaining() / 60);
    const seconds = this.distracteurTimeRemaining() % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  motsForIndice = computed(() => {
    return this.testState().mots.filter(mot => !mot.rappelLibre);
  });

  interpretation = computed(() => {
    const score = this.totalScore();
    if (score >= 8) return 'Score dans la norme';
    return 'Possible trouble mnésique';
  });

  distracteurProgress = computed(() => {
    return Math.round(((180 - this.distracteurTimeRemaining()) / 180) * 100);
  });

  motsAlreadyRecalled = computed(() => {
    return this.testState().mots.filter(mot => mot.rappelLibre).length;
  });

  todayDate = computed(() => {
    return new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  });

  private loadTestData(testId: number, patientId: number, assignationId?: number): void {
    const params: any = { testId, patientId };
    if (assignationId) params.assignationId = assignationId;

    this.http.get<any>(`${this.apiUrl}/test/5mots/questions`, { params }).subscribe({
      next: (response) => {
        this.testState.set({
          mots5TestId: response.testId,
          currentPhase: response.currentPhase,
          mots: response.words || [],
          timer: { actif: false, tempsRestant: 180 },
          completed: false
        });

        // Initialize answer arrays
        this.rappelImmediatAnswers = new Array(response.words.length).fill('');
        this.rappelLibreAnswers = new Array(response.words.length).fill('');
      },
      error: (err) => {
        console.error('Error loading test:', err);
      }
    });
  }

  // Encodage Methods
  nextEncodageWord(): void {
    if (this.isLastEncodageWord()) {
      this.advancePhase();
    } else {
      this.currentEncodageIndex.update(idx => idx + 1);
    }
  }

  // Rappel Immédiat Methods
  canSubmitRappelImmediat(): boolean {
    return this.rappelImmediatAnswers.some(a => a.trim().length > 0);
  }

  submitRappelImmediat(): void {
    const responses = this.testState().mots.map((mot, idx) => ({
      motItemId: mot.id,
      answerText: this.rappelImmediatAnswers[idx],
      timeTakenSeconds: 0
    }));

    this.http.post<any>(`${this.apiUrl}/test/5mots/reponse/batch`, {
      mots5TestId: this.testState().mots5TestId,
      phase: 'RAPPEL_IMMEDIAT',
      responses: responses
    }).subscribe({
      next: () => this.advancePhase(),
      error: (err) => console.error('Error saving responses:', err)
    });
  }

  // Distracteur Methods
  startDistracteurTimer(): void {
    this.distracteurInterval = setInterval(() => {
      this.distracteurTimeRemaining.update(t => {
        if (t <= 0) {
          clearInterval(this.distracteurInterval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  finishDistracteur(): void {
    this.advancePhase();
  }

  // Rappel Libre Methods
  canSubmitRappelLibre(): boolean {
    return this.rappelLibreAnswers.some(a => a.trim().length > 0);
  }

  submitRappelLibre(): void {
    const responses = this.testState().mots.map((mot, idx) => ({
      motItemId: mot.id,
      answerText: this.rappelLibreAnswers[idx],
      timeTakenSeconds: 0
    }));

    this.http.post<any>(`${this.apiUrl}/test/5mots/reponse/batch`, {
      mots5TestId: this.testState().mots5TestId,
      phase: 'RAPPEL_LIBRE',
      responses: responses
    }).subscribe({
      next: () => {
        this.advancePhase();
      },
      error: (err) => console.error('Error saving responses:', err)
    });
  }

  // Rappel Indice Methods
  skipIndice(): void {
    // Skip current indice and move to next or finish
    this.finishTest();
  }

  submitRappelIndice(): void {
    const currentPhase = this.testState().currentPhase;

    // Start timer for distracteur phase
    if (currentPhase === 'RAPPEL_IMMEDIAT') {
      this.startDistracteurTimer();
    }

    const motsNeedingIndice = this.motsForIndice();

    if (motsNeedingIndice.length === 0) {
      this.finishTest();
      return;
    }

    const responses = motsNeedingIndice.map(mot => ({
      motItemId: mot.id,
      answerText: this.rappelIndiceAnswers[mot.id] || '',
      timeTakenSeconds: 0
    }));

    this.http.post<any>(`${this.apiUrl}/test/5mots/reponse/batch`, {
      mots5TestId: this.testState().mots5TestId,
      phase: 'RAPPEL_INDICE',
      responses: responses
    }).subscribe({
      next: () => this.finishTest(),
      error: (err) => console.error('Error saving responses:', err)
    });
  }

  finishTest(): void {
    this.http.post<any>(`${this.apiUrl}/test/5mots/phase/${this.testState().mots5TestId}`, {}).subscribe({
      next: (response) => {
        this.testState.update(state => ({
          ...state,
          currentPhase: response.currentPhase,
          completed: response.isCompleted
        }));
        this.loadResults();
      },
      error: (err) => console.error('Error finishing test:', err)
    });
  }

  private advancePhase(): void {
    const currentPhase = this.testState().currentPhase;

    // Start timer for distracteur phase
    if (currentPhase === 'RAPPEL_IMMEDIAT') {
      this.startDistracteurTimer();
    }

    this.http.post<any>(`${this.apiUrl}/test/5mots/phase/${this.testState().mots5TestId}`, {}).subscribe({
      next: (response) => {
        this.testState.update(state => ({
          ...state,
          currentPhase: response.currentPhase
        }));

        if (response.currentPhase === 'TERMINE') {
          this.loadResults();
        }
      },
      error: (err) => console.error('Error advancing phase:', err)
    });
  }

  private loadResults(): void {
    this.http.get<any>(`${this.apiUrl}/test/5mots/resultats/${this.testState().mots5TestId}`).subscribe({
      next: (response) => {
        this.testResults.set(response.results || []);
        this.totalScore.set(response.scoreTotal || 0);

        // Update mots with results
        this.testState.update(state => ({
          ...state,
          mots: state.mots.map(mot => {
            const result = response.results?.find((r: any) => r.motItemId === mot.id);
            if (result) {
              return {
                ...mot,
                rappelLibre: result.rappelLibre,
                rappelIndice: result.rappelIndice,
                score: result.score
              };
            }
            return mot;
          })
        }));
      },
      error: (err) => console.error('Error loading results:', err)
    });
  }

  returnToDashboard(): void {
    this.router.navigate(['/tests-cognitifs']);
  }
}
