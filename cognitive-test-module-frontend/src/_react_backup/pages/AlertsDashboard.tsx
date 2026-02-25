import { useState } from 'react';
import { Link } from 'react-router';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Trash2,
  Filter,
  Plus,
  FileText,
  Bell
} from 'lucide-react';
import './AlertsDashboard.css';

interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'medical' | 'cognitive' | 'safety';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in-progress' | 'resolved';
  title: string;
  description: string;
  createdAt: string;
  aiConfidence: number;
}

export function AlertsDashboard() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data
  const alerts: Alert[] = [
    {
      id: 'A001',
      patientId: 'P001',
      patientName: 'Sophie Laurent',
      type: 'cognitive',
      severity: 'critical',
      status: 'new',
      title: 'Déclin cognitif rapide détecté',
      description: 'Score MMSE critique (18/30) - Baisse de 5 points en 2 semaines',
      createdAt: '2026-02-04T14:30:00',
      aiConfidence: 92
    },
    {
      id: 'A002',
      patientId: 'P003',
      patientName: 'Marie Dubois',
      type: 'cognitive',
      severity: 'high',
      status: 'in-progress',
      title: 'Troubles de la mémoire à court terme',
      description: 'Résultats du test de mémoire en dessous du seuil - Surveillance recommandée',
      createdAt: '2026-02-04T10:15:00',
      aiConfidence: 87
    },
    {
      id: 'A003',
      patientId: 'P007',
      patientName: 'Jean Martin',
      type: 'medical',
      severity: 'high',
      status: 'new',
      title: 'Absence à rendez-vous important',
      description: 'Patient absent au rendez-vous de suivi du 02/02 - Nécessite contact',
      createdAt: '2026-02-03T16:45:00',
      aiConfidence: 95
    },
    {
      id: 'A004',
      patientId: 'P012',
      patientName: 'Claire Petit',
      type: 'safety',
      severity: 'medium',
      status: 'in-progress',
      title: 'Désorientation spatiale signalée',
      description: 'Aidant signale des difficultés d\'orientation dans des lieux familiers',
      createdAt: '2026-02-03T09:20:00',
      aiConfidence: 78
    },
    {
      id: 'A005',
      patientId: 'P015',
      patientName: 'Pierre Durand',
      type: 'cognitive',
      severity: 'low',
      status: 'resolved',
      title: 'Amélioration notable observée',
      description: 'Progression positive suite au traitement - Surveillance continue',
      createdAt: '2026-02-02T14:10:00',
      aiConfidence: 85
    },
    {
      id: 'A006',
      patientId: 'P008',
      patientName: 'Anne Bernard',
      type: 'medical',
      severity: 'medium',
      status: 'new',
      title: 'Modification de comportement',
      description: 'Changements d\'humeur et d\'appétit signalés par la famille',
      createdAt: '2026-02-01T11:30:00',
      aiConfidence: 81
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const statusMatch = selectedStatus === 'all' || alert.status === selectedStatus;
    return severityMatch && statusMatch;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    pending: alerts.filter(a => a.status === 'new' || a.status === 'in-progress').length
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return '';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertCircle size={20} />;
      case 'medium':
        return <AlertTriangle size={20} />;
      case 'low':
        return <CheckCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'new': { label: 'Nouvelle', class: 'status-new' },
      'in-progress': { label: 'En cours', class: 'status-progress' },
      'resolved': { label: 'Résolue', class: 'status-resolved' }
    };
    return badges[status as keyof typeof badges] || badges.new;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="alerts-dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Système d'Alertes</h1>
          <p className="page-subtitle">
            Gestion et suivi des alertes médicales et cognitives
          </p>
        </div>
        <div className="header-actions">
          <Link to="/alertes/reports" className="btn btn-secondary">
            <FileText size={18} />
            <span>Rapports</span>
          </Link>
          <Link to="/alertes/create" className="btn btn-primary">
            <Plus size={18} />
            <span>Créer une alerte</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-total">
            <Bell size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Alertes</p>
            <p className="kpi-value">{stats.total}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-critical">
            <AlertCircle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Alertes Critiques</p>
            <p className="kpi-value">{stats.critical}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-resolved">
            <CheckCircle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Résolues</p>
            <p className="kpi-value">{stats.resolved}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-pending">
            <Clock size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">En Attente</p>
            <p className="kpi-value">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="alerts-filters">
        <div className="filter-group">
          <Filter size={18} />
          <span className="filter-label">Filtres:</span>
          
          <select 
            value={selectedSeverity} 
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les sévérités</option>
            <option value="critical">Critique</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="new">Nouvelle</option>
            <option value="in-progress">En cours</option>
            <option value="resolved">Résolue</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="table-card">
        <div className="table-container">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>ID Alerte</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Sévérité</th>
                <th>Statut</th>
                <th>Titre</th>
                <th>Créée le</th>
                <th>Confiance IA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="alert-id">{alert.id}</td>
                  <td className="alert-patient">
                    <Link to={`/patients/${alert.patientId}`} className="patient-link">
                      {alert.patientName}
                    </Link>
                  </td>
                  <td>
                    <span className={`type-badge type-${alert.type}`}>
                      {alert.type === 'medical' && 'Médical'}
                      {alert.type === 'cognitive' && 'Cognitif'}
                      {alert.type === 'safety' && 'Sécurité'}
                    </span>
                  </td>
                  <td>
                    <div className={`severity-badge ${getSeverityClass(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                      <span>
                        {alert.severity === 'critical' && 'Critique'}
                        {alert.severity === 'high' && 'Élevée'}
                        {alert.severity === 'medium' && 'Moyenne'}
                        {alert.severity === 'low' && 'Faible'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(alert.status).class}`}>
                      {getStatusBadge(alert.status).label}
                    </span>
                  </td>
                  <td className="alert-title">{alert.title}</td>
                  <td className="alert-date">{formatDate(alert.createdAt)}</td>
                  <td>
                    <div className="confidence-badge">
                      {alert.aiConfidence}%
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/alertes/${alert.id}`} 
                        className="action-btn action-view"
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        className="action-btn action-delete"
                        title="Supprimer"
                        aria-label="Supprimer l'alerte"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAlerts.length === 0 && (
        <div className="empty-state">
          <AlertCircle size={48} />
          <p>Aucune alerte ne correspond aux filtres sélectionnés</p>
        </div>
      )}
    </div>
  );
}