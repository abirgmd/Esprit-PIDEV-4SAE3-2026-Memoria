import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Save,
  AlertTriangle,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import './SafetyZones.css';

interface ZoneCoordinate {
  lat: number;
  lng: number;
}

export function SafetyZones() {
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState<'home' | 'allowed' | 'restricted'>('home');
  const [patientId, setPatientId] = useState('P001');
  const [activeHours, setActiveHours] = useState({ start: '00:00', end: '23:59' });
  const [is24h, setIs24h] = useState(true);
  const [radius, setRadius] = useState(500);

  const patients = [
    { id: 'P001', name: 'Sophie Laurent' },
    { id: 'P003', name: 'Marie Dubois' },
    { id: 'P007', name: 'Jean Martin' },
    { id: 'P012', name: 'Claire Petit' },
    { id: 'P015', name: 'Pierre Durand' }
  ];

  const existingZones = [
    {
      id: 'ZONE001',
      name: 'Domicile - Appartement',
      type: 'home',
      patient: 'Sophie Laurent',
      radius: 100,
      activeHours: '24h/24',
      violations: 0
    },
    {
      id: 'ZONE002',
      name: 'Périmètre autorisé - Centre ville',
      type: 'allowed',
      patient: 'Sophie Laurent',
      radius: 1000,
      activeHours: '08h-20h',
      violations: 2
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating zone:', { zoneName, zoneType, patientId, activeHours, radius });
  };

  const getZoneTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'home': 'Domicile',
      'allowed': 'Zone autorisée',
      'restricted': 'Zone restreinte'
    };
    return labels[type] || type;
  };

  return (
    <div className="safety-zones-container">
      {/* Header */}
      <div className="page-header">
        <Link to="/treatment" className="btn btn-secondary btn-icon">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">Gestion des zones de sécurité</h1>
          <p className="page-subtitle">
            Créez et configurez les zones de surveillance GPS
          </p>
        </div>
      </div>

      <div className="zones-grid">
        {/* Create Zone Form */}
        <div className="form-card">
          <h2 className="form-title">
            <Plus size={20} />
            Créer une nouvelle zone
          </h2>

          <form onSubmit={handleSubmit} className="zone-form">
            <div className="form-section">
              <h3 className="section-title">Informations générales</h3>

              <div className="form-group">
                <label className="form-label">
                  Patient
                  <span className="required">*</span>
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="form-select"
                  required
                >
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Nom de la zone
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="Ex: Domicile - Appartement"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Type de zone
                  <span className="required">*</span>
                </label>
                <div className="zone-type-options">
                  <button
                    type="button"
                    className={`zone-type-btn type-home ${zoneType === 'home' ? 'selected' : ''}`}
                    onClick={() => setZoneType('home')}
                  >
                    <MapPin size={20} />
                    <div>
                      <div className="type-label">Domicile</div>
                      <div className="type-desc">Zone de résidence principale</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`zone-type-btn type-allowed ${zoneType === 'allowed' ? 'selected' : ''}`}
                    onClick={() => setZoneType('allowed')}
                  >
                    <MapPin size={20} />
                    <div>
                      <div className="type-label">Zone autorisée</div>
                      <div className="type-desc">Périmètre de déplacement autorisé</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`zone-type-btn type-restricted ${zoneType === 'restricted' ? 'selected' : ''}`}
                    onClick={() => setZoneType('restricted')}
                  >
                    <AlertTriangle size={20} />
                    <div>
                      <div className="type-label">Zone restreinte</div>
                      <div className="type-desc">Zone à éviter - alerte si entrée</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <MapPin size={18} />
                Paramètres géographiques
              </h3>

              <div className="map-placeholder">
                <MapPin size={48} />
                <p>Carte interactive GPS</p>
                <span>Cliquez sur la carte pour définir le centre de la zone</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Rayon de la zone (mètres)
                </label>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="range-slider"
                />
                <div className="range-value">{radius}m</div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <Clock size={18} />
                Horaires d'activation
              </h3>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={is24h}
                    onChange={(e) => setIs24h(e.target.checked)}
                  />
                  <span>Zone active 24h/24</span>
                </label>
              </div>

              {!is24h && (
                <div className="time-range">
                  <div className="form-group">
                    <label className="form-label">Heure de début</label>
                    <input
                      type="time"
                      value={activeHours.start}
                      onChange={(e) => setActiveHours({ ...activeHours, start: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Heure de fin</label>
                    <input
                      type="time"
                      value={activeHours.end}
                      onChange={(e) => setActiveHours({ ...activeHours, end: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <Link to="/treatment" className="btn btn-secondary">
                Annuler
              </Link>
              <button type="submit" className="btn btn-primary">
                <Save size={18} />
                <span>Créer la zone</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Zones List */}
        <div className="zones-list-card">
          <h2 className="card-title">Zones existantes</h2>
          <div className="zones-list">
            {existingZones.map((zone) => (
              <div key={zone.id} className="zone-item">
                <div className={`zone-type-indicator ${zone.type}`} />
                <div className="zone-info">
                  <div className="zone-header">
                    <h3 className="zone-item-name">{zone.name}</h3>
                    <div className="zone-actions">
                      <button className="action-icon-btn" title="Modifier">
                        <Edit size={16} />
                      </button>
                      <button className="action-icon-btn delete" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="zone-meta">
                    <span className="meta-item">
                      <MapPin size={14} />
                      {getZoneTypeLabel(zone.type)}
                    </span>
                    <span className="meta-item">
                      Rayon: {zone.radius}m
                    </span>
                    <span className="meta-item">
                      <Clock size={14} />
                      {zone.activeHours}
                    </span>
                  </div>
                  <div className="zone-patient">Patient : {zone.patient}</div>
                  {zone.violations > 0 && (
                    <div className="zone-violations">
                      <AlertTriangle size={14} />
                      {zone.violations} violation(s) détectée(s)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
