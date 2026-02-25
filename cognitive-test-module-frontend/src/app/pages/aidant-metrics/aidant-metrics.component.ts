import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MetricsService, AidantMetrics } from '../../services/metrics.service';
import { LucideAngularModule, TrendingUp, Users, CheckCircle, BarChart3, Calendar, Filter } from 'lucide-angular';

@Component({
  selector: 'app-aidant-metrics',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './aidant-metrics.component.html',
  styleUrls: ['./aidant-metrics.component.css']
})
export class AidantMetricsComponent implements OnInit {
  readonly icons = {
    TrendingUp,
    Users,
    CheckCircle,
    BarChart3,
    Calendar,
    Filter
  };

  metrics = signal<AidantMetrics | null>(null);
  aidantId = signal<number | null>(null);
  selectedPeriod = signal<'current' | '6' | '12' | 'all'>('6'); // 6 derniers mois par défaut

  // Données simples pour affichage
  avgScoreByTypeEntries = computed(() => {
    const m = this.metrics();
    if (!m) return [];
    return Object.entries(m.avgScoreByType);
  });

  monthlyCountsEntries = computed(() => {
    const m = this.metrics();
    if (!m) return [];
    const all = Object.entries(m.monthlyCounts);
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    switch (this.selectedPeriod()) {
      case 'current':
        return all.filter(([k]) => k === currentMonth);
      case '6':
        return all.slice(-6);
      case '12':
        return all.slice(-12);
      case 'all':
      default:
        return all;
    }
  });

  // Score moyen calculé simplement : moyenne des scores des tests complétés
  avgScore = computed(() => {
    const m = this.metrics();
    if (!m || m.totalCompleted === 0) return 0;
    // Récupérer tous les scores depuis avgScoreByType et faire la moyenne pondérée par nombre de tests
    const entries = Object.values(m.avgScoreByType);
    if (entries.length === 0) return 0;
    const sum = entries.reduce((s, v) => s + v, 0);
    return sum / entries.length;
  });

  // Taux de réussite : basé sur les scores > 0
  successRate = computed(() => {
    const m = this.metrics();
    if (!m || m.totalCompleted === 0) return 0;
    // Si on a des scores positifs, on considère que c’est réussi
    const positiveScores = Object.values(m.avgScoreByType).filter(v => v > 0).length;
    return (positiveScores / m.totalCompleted) * 100;
  });

  constructor(
    private route: ActivatedRoute,
    private metricsService: MetricsService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const aidantId = params['aidantId'];
      if (aidantId) {
        this.aidantId.set(Number(aidantId));
        this.metricsService.getMetricsForAidant(Number(aidantId)).subscribe({
          next: data => this.metrics.set(data),
          error: err => console.error('Erreur chargement métriques aidant', err)
        });
      }
    });
  }

  exportToCSV() {
    const m = this.metrics();
    if (!m) return;

    const csvRows = [
      ['Métrique', 'Valeur'],
      ['Total assigné', m.totalAssigned.toString()],
      ['Total complété', m.totalCompleted.toString()],
      ['Taux réussite (%)', m.successRate.toFixed(2)],
      ['Score moyen (tests complétés)', this.avgScore().toFixed(2)]
    ];

    // Ajouter les détails par type
    csvRows.push(['']);
    csvRows.push(['Score moyen par type de test']);
    for (const [type, score] of this.avgScoreByTypeEntries()) {
      csvRows.push([type, score.toFixed(2)]);
    }

    // Ajouter les comptes mensuels selon la période choisie
    csvRows.push(['']);
    csvRows.push(['Évolution mensuelle (période : ' + this.selectedPeriod() + ')']);
    for (const [month, count] of this.monthlyCountsEntries()) {
      csvRows.push([month, count.toString()]);
    }

    // Créer le contenu CSV
    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aidant-metrics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
