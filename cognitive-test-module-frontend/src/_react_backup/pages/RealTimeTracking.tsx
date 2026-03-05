import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft,
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Battery,
  Wifi
} from 'lucide-react';
import './RealTimeTracking.css';

interface PatientLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lastUpdate: string;
  isMoving: boolean;
  speed: number;
  battery: number;
  signalStrength: 'excellent' | 'good' | 'fair' | 'poor';
  currentZone?: string;
  zoneViolation: boolean;
}

export function RealTimeTracking() {
  const [selectedPatient, setSelectedPatient] = useState('P001');
  const [trackingActive, setTrackingActive] = useState(true);

  const patients: PatientLocation[] = [
    {
      id: 'P001',
      name: 'Sophie Laurent',
      lat: 48.8566,
      lng: 2.3522,
      lastUpdate: '2026-02-04T15:32:00',
      isMoving: false,
      speed: 0,
      battery: 85,
      signalStrength: 'excellent',
      currentZone: 'Domicile - Appartement',
      zoneViolation: false
    },
    {
      id: 'P003',
      name: 'Marie Dubois',
      lat: 48.8606,
      lng: 2.3376,
      lastUpdate: '2026-02-04T15:30:00',
      isMoving: true,
      speed: 3.5,
      battery: 62,
      signalStrength: 'good',
      currentZone: 'Périmètre autorisé',
      zoneViolation: false
    },
    {
      id: 'P007',
      name: 'Jean Martin',
      lat: 48.8738,
      lng: 2.2950,
      lastUpdate: '2026-02-04T15:28:00',
      isMoving: false,
      speed: 0,
      battery: 45,
      signalStrength: 'fair',
      currentZone: 'Zone restreinte - Gare',
      zoneViolation: true
    }
  ];

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  const getSignalClass = (strength: string) => {
    switch (strength) {
      case 'excellent': return 'signal-excellent';
      case 'good': return 'signal-good';
      case 'fair': return 'signal-fair';
      case 'poor': return 'signal-poor';
      default: return '';
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) {
      return `Il y a ${diffSecs}s`;
    } else if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else {
      return `Il y a ${Math.floor(diffMins / 60)}h`;
    }
  };

  return (
    <div className="tracking-container">
      {/* Header */}
      <div className="page-header">
        <Link to="/treatment" className="btn btn-secondary btn-icon">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">Suivi GPS en temps réel</h1>
          <p className="page-subtitle">
            Surveillance de la position des patients
          </p>
        </div>
        <div className="tracking-status">
          <Activity size={18} className="pulse-icon" />
          <span>Tracking actif</span>
        </div>
      </div>

      <div className="tracking-grid">
        {/* Map Area */}
        <div className="map-card">
          <div className="map-controls">
            <button className="map-btn map-btn-active">
              <MapPin size={16} />
              <span>Vue carte</span>
            </button>
            <button className="map-btn">
              <Navigation size={16} />
              <span>Satellite</span>
            </button>
          </div>

          <div className="map-display">
            <MapPin size={64} />
            <p>Carte interactive GPS</p>
            <span>Position en temps réel : {selectedPatientData?.name}</span>
            <div className="coordinates">
              Lat: {selectedPatientData?.lat.toFixed(4)}, 
              Lng: {selectedPatientData?.lng.toFixed(4)}
            </div>
          </div>

          {/* Map Legend */}
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-marker home" />
              <span>Zone domicile</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker allowed" />
              <span>Zone autorisée</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker restricted" />
              <span>Zone restreinte</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker patient" />
              <span>Position patient</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="tracking-sidebar">
          {/* Patient Selector */}
          <div className="selector-card">
            <label className="selector-label">Patient suivi</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="patient-selector"
            >
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Status */}
          {selectedPatientData && (
            <>
              <div className="status-card">
                <h3 className="status-title">État actuel</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <div className="status-icon">
                      <Activity size={18} />
                    </div>
                    <div>
                      <div className="status-label">Mouvement</div>
                      <div className="status-value">
                        {selectedPatientData.isMoving ? 'En déplacement' : 'Immobile'}
                      </div>
                    </div>
                  </div>

                  <div className="status-item">
                    <div className="status-icon">
                      <Navigation size={18} />
                    </div>
                    <div>
                      <div className="status-label">Vitesse</div>
                      <div className="status-value">{selectedPatientData.speed} km/h</div>
                    </div>
                  </div>

                  <div className="status-item">
                    <div className="status-icon">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="status-label">Dernière maj</div>
                      <div className="status-value">
                        {formatRelativeTime(selectedPatientData.lastUpdate)}
                      </div>
                    </div>
                  </div>

                  <div className="status-item">
                    <div className="status-icon">
                      <Battery size={18} />
                    </div>
                    <div>
                      <div className="status-label">Batterie</div>
                      <div className="status-value">{selectedPatientData.battery}%</div>
                    </div>
                  </div>

                  <div className="status-item">
                    <div className={`status-icon ${getSignalClass(selectedPatientData.signalStrength)}`}>
                      <Wifi size={18} />
                    </div>
                    <div>
                      <div className="status-label">Signal GPS</div>
                      <div className="status-value">
                        {selectedPatientData.signalStrength === 'excellent' && 'Excellent'}
                        {selectedPatientData.signalStrength === 'good' && 'Bon'}
                        {selectedPatientData.signalStrength === 'fair' && 'Moyen'}
                        {selectedPatientData.signalStrength === 'poor' && 'Faible'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zone Status */}
              <div className="zone-status-card">
                <h3 className="status-title">Zone actuelle</h3>
                {selectedPatientData.currentZone ? (
                  <div className={`current-zone ${selectedPatientData.zoneViolation ? 'zone-violation' : 'zone-safe'}`}>
                    <div className="zone-icon">
                      {selectedPatientData.zoneViolation ? (
                        <AlertTriangle size={24} />
                      ) : (
                        <CheckCircle size={24} />
                      )}
                    </div>
                    <div>
                      <div className="zone-name">{selectedPatientData.currentZone}</div>
                      <div className="zone-status-label">
                        {selectedPatientData.zoneViolation ? (
                          <span className="violation-text">⚠️ Violation détectée</span>
                        ) : (
                          <span className="safe-text">✓ Conforme</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-zone">
                    <MapPin size={20} />
                    <span>Hors de toutes les zones</span>
                  </div>
                )}
              </div>

              {/* All Patients List */}
              <div className="patients-list-card">
                <h3 className="status-title">Tous les patients</h3>
                <div className="patients-list">
                  {patients.map(patient => (
                    <button
                      key={patient.id}
                      className={`patient-item ${selectedPatient === patient.id ? 'patient-selected' : ''}`}
                      onClick={() => setSelectedPatient(patient.id)}
                    >
                      <div className="patient-marker">
                        <MapPin size={16} />
                      </div>
                      <div className="patient-info">
                        <div className="patient-name">{patient.name}</div>
                        <div className="patient-status">
                          {patient.zoneViolation && (
                            <span className="status-violation">
                              <AlertTriangle size={12} />
                              Violation
                            </span>
                          )}
                          {!patient.zoneViolation && (
                            <span className="status-ok">
                              <CheckCircle size={12} />
                              Normal
                            </span>
                          )}
                          <span className="patient-battery">
                            <Battery size={12} />
                            {patient.battery}%
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
