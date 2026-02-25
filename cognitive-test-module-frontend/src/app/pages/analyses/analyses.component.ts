import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BarChart3, FileText, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-angular';
import { DecisionService } from '../../services/decision.service';
import { Decision } from '../../models/cognitive-models';

@Component({
  selector: 'app-analyses',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analyses.component.html',
  styleUrl: './analyses.component.css'
})
export class AnalysesComponent implements OnInit {
  private decisionService = inject(DecisionService);

  recentDecisions = signal<Decision[]>([]);

  readonly icons = {
    BarChart3,
    FileText,
    Download,
    AlertTriangle,
    CheckCircle,
    Clock
  };

  ngOnInit() {
    this.loadDecisions();
  }

  loadDecisions() {
    // Mocking patient ID 101 for demo purposes
    this.decisionService.getByPatient(101).subscribe({
      next: (decisions) => this.recentDecisions.set(decisions),
      error: (err) => console.error('Error loading decisions', err)
    });
  }

  getRiskColor(risk: string | undefined): string {
    switch (risk) {
      case 'FAIBLE': return 'text-green-600 bg-green-100';
      case 'MOYEN': return 'text-yellow-600 bg-yellow-100';
      case 'ELEVE': return 'text-orange-600 bg-orange-100';
      case 'CRITIQUE': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
}
