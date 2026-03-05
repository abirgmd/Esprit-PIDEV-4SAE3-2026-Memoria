import { Link } from 'react-router';
import { 
  ArrowLeft,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  Shield,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import './CommunityAnalytics.css';

export function CommunityAnalytics() {
  const analytics = {
    totalMessages: 1247,
    totalModerated: 23,
    totalFlagged: 8,
    totalMembers: 248,
    avgSentiment: 72, // percentage positive
    messagesThisWeek: 156,
    weekGrowth: 12.5
  };

  const sentimentData = [
    { type: 'Positif', count: 892, percentage: 71.5, color: '#4CAF50' },
    { type: 'Neutre', count: 278, percentage: 22.3, color: '#9E9E9E' },
    { type: 'Négatif', count: 77, percentage: 6.2, color: '#F44336' }
  ];

  const moderationLog = [
    {
      id: 'MOD001',
      messageId: 'M1234',
      author: 'Utilisateur A',
      action: 'Approuvé',
      reason: 'Contenu sensible mais approprié',
      timestamp: '2026-02-04T14:30:00',
      moderator: 'IA Auto-modération'
    },
    {
      id: 'MOD002',
      messageId: 'M1235',
      author: 'Utilisateur B',
      action: 'Signalé',
      reason: 'Langage inapproprié détecté',
      timestamp: '2026-02-04T12:15:00',
      moderator: 'IA Auto-modération'
    },
    {
      id: 'MOD003',
      messageId: 'M1236',
      author: 'Utilisateur C',
      action: 'Supprimé',
      reason: 'Spam commercial',
      timestamp: '2026-02-03T16:45:00',
      moderator: 'Dr. Sophie Laurent'
    },
    {
      id: 'MOD004',
      messageId: 'M1237',
      author: 'Utilisateur D',
      action: 'Approuvé',
      reason: 'Validation manuelle requise',
      timestamp: '2026-02-03T10:20:00',
      moderator: 'Dr. Marie Dubois'
    }
  ];

  const flaggedContent = [
    {
      id: 'FLAG001',
      messageId: 'M5678',
      author: 'Marie D.',
      excerpt: 'Ce message contient du contenu potentiellement sensible...',
      reason: 'Langage agressif',
      flagCount: 3,
      status: 'En révision',
      timestamp: '2026-02-04T09:30:00'
    },
    {
      id: 'FLAG002',
      messageId: 'M5679',
      author: 'Jean M.',
      excerpt: 'Publicité pour un produit miracle contre...',
      reason: 'Spam / Publicité',
      flagCount: 7,
      status: 'Urgent',
      timestamp: '2026-02-03T18:15:00'
    }
  ];

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'Approuvé': return 'badge-approved';
      case 'Signalé': return 'badge-flagged';
      case 'Supprimé': return 'badge-deleted';
      default: return '';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Urgent': return 'badge-urgent';
      case 'En révision': return 'badge-review';
      default: return '';
    }
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="page-header">
        <Link to="/communaute" className="btn btn-secondary btn-icon">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">Analytics Communauté</h1>
          <p className="page-subtitle">
            Statistiques et modération de la communauté
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-messages">
            <MessageCircle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Messages totaux</p>
            <p className="kpi-value">{analytics.totalMessages.toLocaleString('fr-FR')}</p>
            <p className="kpi-trend kpi-trend-up">
              <TrendingUp size={14} />
              +{analytics.weekGrowth}% cette semaine
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-moderated">
            <Shield size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Messages modérés</p>
            <p className="kpi-value">{analytics.totalModerated}</p>
            <p className="kpi-detail">
              {((analytics.totalModerated / analytics.totalMessages) * 100).toFixed(1)}% du total
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-flagged">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Contenus signalés</p>
            <p className="kpi-value">{analytics.totalFlagged}</p>
            <p className="kpi-detail">En attente de révision</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-sentiment">
            <Smile size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Sentiment positif</p>
            <p className="kpi-value">{analytics.avgSentiment}%</p>
            <p className="kpi-detail">Moyenne communauté</p>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="analytics-card">
        <h2 className="card-title">Distribution du sentiment (IA)</h2>
        <div className="sentiment-chart">
          {sentimentData.map((item) => (
            <div key={item.type} className="sentiment-row">
              <div className="sentiment-info">
                <div className="sentiment-icon" style={{ color: item.color }}>
                  {item.type === 'Positif' && <Smile size={20} />}
                  {item.type === 'Neutre' && <Meh size={20} />}
                  {item.type === 'Négatif' && <Frown size={20} />}
                </div>
                <span className="sentiment-label">{item.type}</span>
              </div>
              <div className="sentiment-bar-container">
                <div 
                  className="sentiment-bar" 
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <div className="sentiment-stats">
                <span className="sentiment-count">{item.count}</span>
                <span className="sentiment-percentage">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Content */}
      <div className="analytics-card">
        <div className="card-header">
          <h2 className="card-title">Contenus signalés</h2>
          <span className="badge badge-urgent">{flaggedContent.length} en attente</span>
        </div>
        <div className="table-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Auteur</th>
                <th>Extrait</th>
                <th>Raison</th>
                <th>Signalements</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flaggedContent.map((item) => (
                <tr key={item.id}>
                  <td className="author-cell">{item.author}</td>
                  <td className="excerpt-cell">{item.excerpt}</td>
                  <td>
                    <span className="reason-badge">{item.reason}</span>
                  </td>
                  <td className="count-cell">{item.flagCount}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="date-cell">{formatDate(item.timestamp)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn action-approve">Approuver</button>
                      <button className="action-btn action-delete">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Log */}
      <div className="analytics-card">
        <h2 className="card-title">Journal de modération</h2>
        <div className="table-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>ID Message</th>
                <th>Auteur</th>
                <th>Action</th>
                <th>Raison</th>
                <th>Modérateur</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {moderationLog.map((log) => (
                <tr key={log.id}>
                  <td className="id-cell">{log.messageId}</td>
                  <td className="author-cell">{log.author}</td>
                  <td>
                    <span className={`action-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="reason-cell">{log.reason}</td>
                  <td className="moderator-cell">{log.moderator}</td>
                  <td className="date-cell">{formatDate(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
