import { Link } from 'react-router';
import { 
  Brain,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Calendar,
  Eye,
  Play
} from 'lucide-react';
import './DiagnosisDashboard.css';

interface DiagnosisTest {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'validated';
  score?: number;
  maxScore?: number;
  percentage?: number;
  date: string;
  validatedBy?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export function DiagnosisDashboard() {
  const tests: DiagnosisTest[] = [
    {
      id: 'DIA001',
      patientId: 'P001',
      patientName: 'Sophie Laurent',
      testType: 'MMSE',
      status: 'completed',
      score: 18,
      maxScore: 30,
      percentage: 60,
      date: '2026-02-04T10:30:00',
      riskLevel: 'critical'
    },
    {
      id: 'DIA002',
      patientId: 'P003',
      patientName: 'Marie Dubois',
      testType: 'Test de l\'horloge',
      status: 'validated',
      score: 8,
      maxScore: 10,
      percentage: 80,
      date: '2026-02-03T14:00:00',
      validatedBy: 'Dr. Jean Martin',
      riskLevel: 'medium'
    },
    {
      id: 'DIA003',
      patientId: 'P007',
      patientName: 'Jean Martin',
      testType: 'MoCA',
      status: 'in-progress',
      date: '2026-02-04T15:00:00'
    },
    {
      id: 'DIA004',
      patientId: 'P012',
      patientName: 'Claire Petit',
      testType: 'MMSE',
      status: 'completed',
      score: 24,
      maxScore: 30,
      percentage: 80,
      date: '2026-02-02T11:00:00',
      riskLevel: 'medium'
    },
    {
      id: 'DIA005',
      patientId: 'P015',
      patientName: 'Pierre Durand',
      testType: 'Test des 5 mots',
      status: 'validated',
      score: 9,
      maxScore: 10,
      percentage: 90,
      date: '2026-02-01T09:30:00',
      validatedBy: 'Dr. Sophie Laurent',
      riskLevel: 'low'
    },
    {
      id: 'DIA006',
      patientId: 'P008',
      patientName: 'Anne Bernard',
      testType: 'MMSE',
      status: 'pending',
      date: '2026-02-05T10:00:00'
    }
  ];

  const stats = {
    total: tests.length,
    completed: tests.filter(t => t.status === 'completed' || t.status === 'validated').length,
    inProgress: tests.filter(t => t.status === 'in-progress').length,
    pending: tests.filter(t => t.status === 'pending').length,
    avgScore: Math.round(
      tests
        .filter(t => t.percentage)
        .reduce((sum, t) => sum + (t.percentage || 0), 0) /
      tests.filter(t => t.percentage).length
    )
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
      'pending': { 
        label: 'En attente', 
        class: 'status-pending',
        icon: <Clock size={14} />
      },
      'in-progress': { 
        label: 'En cours', 
        class: 'status-progress',
        icon: <Play size={14} />
      },
      'completed': { 
        label: 'Terminé', 
        class: 'status-completed',
        icon: <CheckCircle size={14} />
      },
      'validated': { 
        label: 'Validé', 
        class: 'status-validated',
        icon: <CheckCircle size={14} />
      }
    };
    return badges[status];
  };

  const getRiskBadge = (risk?: string) => {
    if (!risk) return null;
    const badges: Record<string, { label: string; class: string }> = {
      'low': { label: 'Faible', class: 'risk-low' },
      'medium': { label: 'Modéré', class: 'risk-medium' },
      'high': { label: 'Élevé', class: 'risk-high' },
      'critical': { label: 'Critique', class: 'risk-critical' }
    };
    return badges[risk];
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  return (
    <div className="diagnosis-dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Diagnostic</h1>
          <p className="page-subtitle">
            Tests cognitifs et diagnostics Alzheimer
          </p>
        </div>
        <Link to="/diagnosis/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Nouveau test</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-total">
            <FileText size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Tests totaux</p>
            <p className="kpi-value">{stats.total}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-completed">
            <CheckCircle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Terminés</p>
            <p className="kpi-value">{stats.completed}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-progress">
            <Clock size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">En cours</p>
            <p className="kpi-value">{stats.inProgress}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-avg">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Score moyen</p>
            <p className="kpi-value">{stats.avgScore}%</p>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="table-card">
        <div className="table-header">
          <h2 className="table-title">Historique des tests</h2>
        </div>
        <div className="table-container">
          <table className="diagnosis-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Type de test</th>
                <th>Statut</th>
                <th>Score</th>
                <th>Risque</th>
                <th>Date</th>
                <th>Validé par</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="test-id">{test.id}</td>
                  <td className="patient-name">
                    <Link to={`/patients/${test.patientId}`} className="patient-link">
                      {test.patientName}
                    </Link>
                  </td>
                  <td className="test-type">
                    <div className="type-badge">
                      <Brain size={14} />
                      <span>{test.testType}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`status-badge ${getStatusBadge(test.status).class}`}>
                      {getStatusBadge(test.status).icon}
                      <span>{getStatusBadge(test.status).label}</span>
                    </div>
                  </td>
                  <td className="score-cell">
                    {test.score !== undefined ? (
                      <div className="score-display">
                        <span className="score-value">{test.score}/{test.maxScore}</span>
                        <span className="score-percentage">({test.percentage}%)</span>
                      </div>
                    ) : (
                      <span className="no-data">—</span>
                    )}
                  </td>
                  <td>
                    {test.riskLevel ? (
                      <span className={`risk-badge ${getRiskBadge(test.riskLevel)?.class}`}>
                        {getRiskBadge(test.riskLevel)?.label}
                      </span>
                    ) : (
                      <span className="no-data">—</span>
                    )}
                  </td>
                  <td className="date-cell">{formatDate(test.date)}</td>
                  <td className="validator-cell">
                    {test.validatedBy || <span className="no-data">—</span>}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {test.status === 'pending' && (
                        <Link 
                          to={`/diagnosis/${test.id}/execute`}
                          className="action-btn action-start"
                          title="Démarrer le test"
                        >
                          <Play size={16} />
                        </Link>
                      )}
                      {test.status === 'in-progress' && (
                        <Link 
                          to={`/diagnosis/${test.id}/execute`}
                          className="action-btn action-continue"
                          title="Continuer le test"
                        >
                          <Play size={16} />
                        </Link>
                      )}
                      {(test.status === 'completed' || test.status === 'validated') && (
                        <Link 
                          to={`/diagnosis/${test.id}/results`}
                          className="action-btn action-view"
                          title="Voir les résultats"
                        >
                          <Eye size={16} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
