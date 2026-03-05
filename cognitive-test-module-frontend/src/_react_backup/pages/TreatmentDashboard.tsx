import { Link } from 'react-router';
import { 
  Shield,
  Plus,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';
import './TreatmentDashboard.css';

interface SafetyZone {
  id: string;
  patientId: string;
  patientName: string;
  zoneName: string;
  type: 'home' | 'allowed' | 'restricted';
  status: 'active' | 'inactive';
  violations: number;
  lastCheck: string;
  activeHours?: string;
}

export function TreatmentDashboard() {
  const zones: SafetyZone[] = [
    {
      id: 'ZONE001',
      patientId: 'P001',
      patientName: 'Sophie Laurent',
      zoneName: 'Domicile - Appartement',
      type: 'home',
      status: 'active',
      violations: 0,
      lastCheck: '2026-02-04T15:30:00',
      activeHours: '24h/24'
    },
    {
      id: 'ZONE002',
      patientId: 'P001',
      patientName: 'Sophie Laurent',
      zoneName: 'Périmètre autorisé - Centre ville',
      type: 'allowed',
      status: 'active',
      violations: 2,
      lastCheck: '2026-02-04T15:25:00',
      activeHours: '08h-20h'
    },
    {
      id: 'ZONE003',
      patientId: 'P003',
      patientName: 'Marie Dubois',
      zoneName: 'Domicile - Maison',
      type: 'home',
      status: 'active',
      violations: 0,
      lastCheck: '2026-02-04T15:28:00',
      activeHours: '24h/24'
    },
    {
      id: 'ZONE004',
      patientId: 'P007',
      patientName: 'Jean Martin',
      zoneName: 'Zone restreinte - Gare routière',
      type: 'restricted',
      status: 'active',
      violations: 1,
      lastCheck: '2026-02-03T18:15:00',
      activeHours: '24h/24'
    },
    {
      id: 'ZONE005',
      patientId: 'P012',
      patientName: 'Claire Petit',
      zoneName: 'Domicile - Résidence',
      type: 'home',
      status: 'active',
      violations: 0,
      lastCheck: '2026-02-04T15:20:00',
      activeHours: '24h/24'
    },
    {
      id: 'ZONE006',
      patientId: 'P015',
      patientName: 'Pierre Durand',
      zoneName: 'Périmètre autorisé - Parc municipal',
      type: 'allowed',
      status: 'inactive',
      violations: 0,
      lastCheck: '2026-02-02T10:00:00',
      activeHours: '09h-18h'
    }
  ];

  const stats = {
    totalZones: zones.length,
    activeZones: zones.filter(z => z.status === 'active').length,
    violations: zones.reduce((sum, z) => sum + z.violations, 0),
    criticalAlerts: zones.filter(z => z.type === 'restricted' && z.violations > 0).length
  };

  const recentAlerts = [
    {
      id: 'ALT001',
      patientName: 'Sophie Laurent',
      zoneName: 'Périmètre autorisé - Centre ville',
      type: 'violation',
      message: 'Sortie du périmètre autorisé détectée',
      timestamp: '2026-02-04T14:45:00',
      severity: 'medium'
    },
    {
      id: 'ALT002',
      patientName: 'Jean Martin',
      zoneName: 'Zone restreinte - Gare routière',
      type: 'entry',
      message: 'Entrée dans zone restreinte détectée',
      timestamp: '2026-02-03T18:15:00',
      severity: 'high'
    },
    {
      id: 'ALT003',
      patientName: 'Sophie Laurent',
      zoneName: 'Périmètre autorisé - Centre ville',
      type: 'violation',
      message: 'Sortie du périmètre en dehors des heures autorisées',
      timestamp: '2026-02-02T22:30:00',
      severity: 'medium'
    }
  ];

  const getZoneTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      'home': { label: 'Domicile', class: 'type-home' },
      'allowed': { label: 'Autorisé', class: 'type-allowed' },
      'restricted': { label: 'Restreint', class: 'type-restricted' }
    };
    return badges[type];
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffMins < 1440) {
      return `Il y a ${Math.floor(diffMins / 60)}h`;
    } else {
      return formatDate(dateStr);
    }
  };

  return (
    <div className="treatment-dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Traitement & Surveillance</h1>
          <p className="page-subtitle">
            Zones de sécurité et tracking GPS en temps réel
          </p>
        </div>
        <Link to="/treatment/zones/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Nouvelle zone</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-total">
            <Shield size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Zones totales</p>
            <p className="kpi-value">{stats.totalZones}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-active">
            <CheckCircle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Zones actives</p>
            <p className="kpi-value">{stats.activeZones}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-violations">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Violations</p>
            <p className="kpi-value">{stats.violations}</p>
            <p className="kpi-trend kpi-trend-down">
              Cette semaine
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-critical">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Alertes critiques</p>
            <p className="kpi-value">{stats.criticalAlerts}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Zones Table */}
        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Zones de sécurité</h2>
            <Link to="/treatment/tracking" className="btn btn-secondary btn-sm">
              <MapPin size={16} />
              <span>Tracking live</span>
            </Link>
          </div>
          <div className="table-container">
            <table className="treatment-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Nom de la zone</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Violations</th>
                  <th>Horaires</th>
                  <th>Dernière vérif.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id}>
                    <td className="patient-name">
                      <Link to={`/patients/${zone.patientId}`} className="patient-link">
                        {zone.patientName}
                      </Link>
                    </td>
                    <td className="zone-name">{zone.zoneName}</td>
                    <td>
                      <span className={`type-badge ${getZoneTypeBadge(zone.type).class}`}>
                        {getZoneTypeBadge(zone.type).label}
                      </span>
                    </td>
                    <td>
                      <div className={`status-badge ${zone.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                        {zone.status === 'active' ? (
                          <><CheckCircle size={12} /> Actif</>
                        ) : (
                          <><Clock size={12} /> Inactif</>
                        )}
                      </div>
                    </td>
                    <td className="violations-cell">
                      {zone.violations > 0 ? (
                        <span className="violations-badge">{zone.violations}</span>
                      ) : (
                        <span className="no-violations">0</span>
                      )}
                    </td>
                    <td className="hours-cell">{zone.activeHours}</td>
                    <td className="time-cell">{formatRelativeTime(zone.lastCheck)}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/treatment/zones/${zone.id}`}
                          className="action-btn action-view"
                          title="Voir la zone"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link 
                          to={`/treatment/tracking?patient=${zone.patientId}`}
                          className="action-btn action-track"
                          title="Tracking en direct"
                        >
                          <MapPin size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="alerts-card">
          <h2 className="card-title">
            <AlertTriangle size={20} />
            Alertes récentes
          </h2>
          <div className="alerts-list">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`alert-item ${getSeverityClass(alert.severity)}`}>
                <div className="alert-icon">
                  <AlertTriangle size={18} />
                </div>
                <div className="alert-content">
                  <div className="alert-header">
                    <span className="alert-patient">{alert.patientName}</span>
                    <span className="alert-time">{formatRelativeTime(alert.timestamp)}</span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  <span className="alert-zone">{alert.zoneName}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/alertes" className="view-all-link">
            Voir toutes les alertes →
          </Link>
        </div>
      </div>
    </div>
  );
}
