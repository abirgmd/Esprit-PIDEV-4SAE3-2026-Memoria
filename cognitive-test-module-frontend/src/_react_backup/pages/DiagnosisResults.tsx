import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Send,
  Brain,
  TrendingDown
} from 'lucide-react';
import './DiagnosisResults.css';

export function DiagnosisResults() {
  const { id } = useParams();
  const [validationNote, setValidationNote] = useState('');

  const results = {
    id: id || 'DIA001',
    patientName: 'Sophie Laurent',
    patientAge: 78,
    testType: 'MMSE',
    date: '2026-02-04T10:30:00',
    duration: '18 minutes',
    score: 18,
    maxScore: 30,
    percentage: 60,
    riskLevel: 'critical',
    previousScore: 23,
    scoreChange: -5,
    validated: false,
    aiSummary: 'L\'analyse IA indique un déclin cognitif significatif avec des déficits marqués dans l\'orientation temporelle et la mémoire à court terme. Le patient présente également des difficultés dans les tâches de calcul mental et le rappel différé. Ces résultats suggèrent une démence modérée.',
    recommendations: [
      'Consultation neurologique en urgence recommandée',
      'Imagerie cérébrale (IRM) à planifier',
      'Évaluation complète du statut fonctionnel',
      'Mise en place d\'un plan de soins adapté',
      'Information et soutien de la famille'
    ],
    categoryScores: [
      { category: 'Orientation temporelle', score: 2, max: 5, percentage: 40 },
      { category: 'Orientation spatiale', score: 3, max: 5, percentage: 60 },
      { category: 'Apprentissage', score: 2, max: 3, percentage: 67 },
      { category: 'Attention et calcul', score: 1, max: 5, percentage: 20 },
      { category: 'Rappel', score: 1, max: 3, percentage: 33 },
      { category: 'Langage', score: 7, max: 8, percentage: 88 },
      { category: 'Praxies', score: 2, max: 1, percentage: 100 }
    ]
  };

  const getRiskClass = (risk: string) => {
    switch (risk) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      case 'critical': return 'risk-critical';
      default: return '';
    }
  };

  const getRiskLabel = (risk: string) => {
    const labels: Record<string, string> = {
      'low': 'Faible',
      'medium': 'Modéré',
      'high': 'Élevé',
      'critical': 'Critique'
    };
    return labels[risk] || risk;
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const handleValidate = () => {
    // Validation logic here
    console.log('Test validated with note:', validationNote);
  };

  return (
    <div className="diagnosis-results-container">
      {/* Header */}
      <div className="page-header">
        <Link to="/diagnosis" className="btn btn-secondary btn-icon">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">Résultats du diagnostic</h1>
          <p className="page-subtitle">
            {results.testType} - {results.patientName} ({results.patientAge} ans)
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={18} />
            <span>Exporter PDF</span>
          </button>
          <button className="btn btn-secondary">
            <Send size={18} />
            <span>Partager</span>
          </button>
        </div>
      </div>

      {/* Score Card */}
      <div className={`score-card ${getRiskClass(results.riskLevel)}`}>
        <div className="score-main">
          <div className="score-value-container">
            <span className="score-value">{results.score}</span>
            <span className="score-separator">/</span>
            <span className="score-max">{results.maxScore}</span>
          </div>
          <div className="score-percentage">{results.percentage}%</div>
        </div>
        <div className="score-details">
          <div className="risk-badge-large">
            <AlertCircle size={20} />
            <span>Risque {getRiskLabel(results.riskLevel)}</span>
          </div>
          {results.previousScore && (
            <div className="score-evolution">
              <TrendingDown size={18} />
              <span>
                Évolution : {results.scoreChange > 0 ? '+' : ''}{results.scoreChange} points
                (précédent : {results.previousScore}/{results.maxScore})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Test Info */}
      <div className="info-grid">
        <div className="info-card">
          <span className="info-label">Date du test</span>
          <span className="info-value">{formatDate(results.date)}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Durée</span>
          <span className="info-value">{results.duration}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Type de test</span>
          <span className="info-value">{results.testType}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Statut</span>
          <span className={`status-badge ${results.validated ? 'status-validated' : 'status-pending'}`}>
            {results.validated ? 'Validé' : 'En attente de validation'}
          </span>
        </div>
      </div>

      {/* Category Scores */}
      <div className="results-card">
        <h2 className="card-title">
          <Brain size={20} />
          Résultats par catégorie
        </h2>
        <div className="categories-list">
          {results.categoryScores.map((cat, index) => (
            <div key={index} className="category-item">
              <div className="category-header">
                <span className="category-name">{cat.category}</span>
                <span className="category-score">{cat.score}/{cat.max}</span>
              </div>
              <div className="category-bar-container">
                <div 
                  className={`category-bar ${cat.percentage < 50 ? 'bar-danger' : cat.percentage < 75 ? 'bar-warning' : 'bar-success'}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <span className="category-percentage">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="results-card">
        <h2 className="card-title">
          <FileText size={20} />
          Synthèse automatique (IA)
        </h2>
        <div className="ai-summary-content">
          <div className="ai-badge">
            <span>Généré automatiquement par IA</span>
          </div>
          <p className="summary-text">{results.aiSummary}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="results-card">
        <h2 className="card-title">
          <CheckCircle size={20} />
          Recommandations
        </h2>
        <ul className="recommendations-list">
          {results.recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              <div className="rec-bullet">
                <CheckCircle size={16} />
              </div>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Doctor Validation */}
      {!results.validated && (
        <div className="validation-card">
          <h2 className="card-title">
            <CheckCircle size={20} />
            Validation médicale
          </h2>
          <div className="validation-form">
            <label className="input-label">
              Notes et commentaires du médecin
            </label>
            <textarea
              className="validation-textarea"
              rows={4}
              value={validationNote}
              onChange={(e) => setValidationNote(e.target.value)}
              placeholder="Ajoutez vos observations et commentaires sur ce diagnostic..."
            />
            <div className="validation-actions">
              <button className="btn btn-secondary">
                Demander une révision
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleValidate}
              >
                <CheckCircle size={18} />
                <span>Valider le diagnostic</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
