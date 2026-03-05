import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  AlertCircle, 
  User, 
  Calendar,
  Clock,
  Brain,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  Activity,
  Trash2
} from 'lucide-react';
import './AlertDetails.css';

interface TimelineEvent {
  type: 'created' | 'updated' | 'escalated' | 'resolved';
  timestamp: string;
  user: string;
  description: string;
}

export function AlertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alertStatus, setAlertStatus] = useState<'new' | 'in-progress' | 'resolved'>('new');

  // Mock alert data
  const alert = {
    id: id || 'A001',
    patientId: 'P001',
    patientName: 'Sophie Laurent',
    patientAge: 72,
    type: 'cognitive',
    severity: 85,
    status: alertStatus,
    title: 'Déclin cognitif rapide détecté',
    description: 'Score MMSE critique (18/30) - Baisse de 5 points en 2 semaines. Le patient montre des signes de confusion temporelle et spatiale accrus. Les tests de mémoire à court terme révèlent des difficultés importantes.',
    createdAt: '2026-02-04T14:30:00',
    lastUpdate: '2026-02-04T16:15:00',
    aiConfidence: 92,
    factors: [
      'Déclin du score MMSE de 23 à 18 en 2 semaines',
      'Difficultés accrues dans les tâches quotidiennes',
      'Désorientation temporelle fréquente',
      'Troubles de la mémoire à court terme'
    ],
    recommendation: 'Consultation neurologique urgente recommandée. Réévaluation cognitive complète nécessaire. Surveillance rapprochée des symptômes.',
    timeline: [
      {
        type: 'created' as const,
        timestamp: '2026-02-04T14:30:00',
        user: 'Dr. Martin Leroy',
        description: 'Alerte créée automatiquement suite à l\'analyse des résultats de test'
      },
      {
        type: 'escalated' as const,
        timestamp: '2026-02-04T15:45:00',
        user: 'Système IA',
        description: 'Alerte escaladée en priorité critique en raison de la rapidité du déclin'
      },
      {
        type: 'updated' as const,
        timestamp: '2026-02-04T16:15:00',
        user: 'Dr. Martin Leroy',
        description: 'Consultation avec la famille planifiée pour demain'
      }
    ]
  };

  const handleResolve = () => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette alerte comme résolue ?')) {
      setAlertStatus('resolved');
      alert('Alerte marquée comme résolue');
    }
  };

  const handleEscalate = () => {
    if (window.confirm('Êtes-vous sûr de vouloir escalader cette alerte ?')) {
      alert('Alerte escaladée avec succès');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action est irréversible.')) {
      navigate('/alertes');
    }
  };

  const getSeverityClass = (severity: number) => {
    if (severity >= 75) return 'severity-critical';
    if (severity >= 50) return 'severity-high';
    if (severity >= 25) return 'severity-medium';
    return 'severity-low';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 75) return 'Critique';
    if (severity >= 50) return 'Élevée';
    if (severity >= 25) return 'Moyenne';
    return 'Faible';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'new': { label: 'Nouvelle', class: 'status-new', icon: <AlertCircle size={16} /> },
      'in-progress': { label: 'En cours', class: 'status-progress', icon: <Clock size={16} /> },
      'resolved': { label: 'Résolue', class: 'status-resolved', icon: <CheckCircle size={16} /> }
    };
    return badges[status as keyof typeof badges] || badges.new;
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'created': return <AlertCircle size={20} />;
      case 'updated': return <Activity size={20} />;
      case 'escalated': return <TrendingUp size={20} />;
      case 'resolved': return <CheckCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const statusInfo = getStatusBadge(alertStatus);

  return (
    <div className="alert-details-container">
      {/* Back Link */}
      <Link to="/alertes" className="back-link">
        <ArrowLeft size={18} />
        Retour aux alertes
      </Link>

      {/* Header */}
      <div className="alert-header">
        <div className="alert-header-main">
          <div className="alert-id-badge">#{alert.id}</div>
          <h1 className="alert-title-main">{alert.title}</h1>
          <div className={`status-badge-large ${statusInfo.class}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </div>
        </div>

        <div className="alert-actions">
          {alertStatus !== 'resolved' && (
            <>
              <button onClick={handleResolve} className="btn btn-primary">
                <CheckCircle size={18} />
                Résoudre
              </button>
              <button onClick={handleEscalate} className="btn btn-secondary">
                <TrendingUp size={18} />
                Escalader
              </button>
            </>
          )}
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={18} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="alert-content-grid">
        {/* Left Column */}
        <div className="alert-main-column">
          {/* Alert Summary */}
          <div className="info-card">
            <h2 className="card-title">
              <AlertCircle size={20} />
              Informations de l'Alerte
            </h2>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Patient</span>
                <Link to={`/patients/${alert.patientId}`} className="patient-link-detail">
                  <User size={16} />
                  {alert.patientName}, {alert.patientAge} ans
                </Link>
              </div>

              <div className="info-item">
                <span className="info-label">Type d'alerte</span>
                <span className={`type-badge-detail type-${alert.type}`}>
                  <Brain size={16} />
                  {alert.type === 'medical' && 'Médical'}
                  {alert.type === 'cognitive' && 'Cognitif'}
                  {alert.type === 'safety' && 'Sécurité'}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Créée le</span>
                <span className="info-value">
                  <Calendar size={16} />
                  {formatDate(alert.createdAt)}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Dernière mise à jour</span>
                <span className="info-value">
                  <Clock size={16} />
                  {formatDate(alert.lastUpdate)}
                </span>
              </div>
            </div>

            <div className="alert-description">
              <h3>Description</h3>
              <p>{alert.description}</p>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="info-card">
            <h2 className="card-title">
              <Brain size={20} />
              Analyse IA
            </h2>

            <div className="ai-explanation">
              <div className="ai-confidence-display">
                <div className="confidence-circle">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#E1E3EB"
                      strokeWidth="12"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeDasharray={`${(alert.aiConfidence / 100) * 339.292} 339.292`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#541A75" />
                        <stop offset="100%" stopColor="#7E3CA3" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="confidence-value">
                    <span className="confidence-number">{alert.aiConfidence}</span>
                    <span className="confidence-percent">%</span>
                  </div>
                </div>
                <div className="confidence-label">
                  Confiance IA
                </div>
              </div>

              <div className="ai-factors">
                <h3>Facteurs identifiés</h3>
                <ul className="factors-list">
                  {alert.factors.map((factor, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="ai-recommendation">
              <div className="recommendation-header">
                <Shield size={20} />
                <h3>Recommandation</h3>
              </div>
              <p>{alert.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="alert-side-column">
          {/* Severity Gauge */}
          <div className="info-card">
            <h2 className="card-title">
              <AlertTriangle size={20} />
              Sévérité
            </h2>

            <div className="severity-gauge">
              <div className={`severity-circle ${getSeverityClass(alert.severity)}`}>
                <span className="severity-score">{alert.severity}</span>
                <span className="severity-max">/100</span>
              </div>
              <div className={`severity-label-large ${getSeverityClass(alert.severity)}`}>
                {getSeverityLabel(alert.severity)}
              </div>
            </div>

            <div className="severity-bar-container">
              <div className="severity-bar">
                <div 
                  className={`severity-bar-fill ${getSeverityClass(alert.severity)}`}
                  style={{ width: `${alert.severity}%` }}
                />
              </div>
              <div className="severity-scale-labels">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="info-card">
            <h2 className="card-title">
              <Activity size={20} />
              Historique
            </h2>

            <div className="timeline">
              {alert.timeline.map((event, index) => (
                <div key={index} className={`timeline-item timeline-${event.type}`}>
                  <div className="timeline-icon">
                    {getTimelineIcon(event.type)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-type">
                        {event.type === 'created' && 'Création'}
                        {event.type === 'updated' && 'Mise à jour'}
                        {event.type === 'escalated' && 'Escalade'}
                        {event.type === 'resolved' && 'Résolution'}
                      </span>
                      <span className="timeline-time">
                        {new Date(event.timestamp).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="timeline-description">{event.description}</p>
                    <p className="timeline-user">{event.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
