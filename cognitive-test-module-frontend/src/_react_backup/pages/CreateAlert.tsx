import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, AlertCircle, Mail, MessageSquare, Save } from 'lucide-react';
import './CreateAlert.css';

interface Patient {
  id: string;
  name: string;
}

export function CreateAlert() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    category: 'medical',
    title: '',
    description: '',
    severity: 50,
    notifyEmail: true,
    notifySms: false
  });

  // Mock patients data
  const patients: Patient[] = [
    { id: 'P001', name: 'Sophie Laurent' },
    { id: 'P003', name: 'Marie Dubois' },
    { id: 'P007', name: 'Jean Martin' },
    { id: 'P008', name: 'Anne Bernard' },
    { id: 'P012', name: 'Claire Petit' },
    { id: 'P015', name: 'Pierre Durand' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate alert creation
    console.log('Creating alert:', formData);
    
    // Show success message (in real app, use toast notification)
    alert('Alerte créée avec succès !');
    
    // Redirect to alerts dashboard
    navigate('/alertes');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSeverityLabel = () => {
    const severity = formData.severity;
    if (severity >= 75) return { label: 'Critique', class: 'severity-critical' };
    if (severity >= 50) return { label: 'Élevée', class: 'severity-high' };
    if (severity >= 25) return { label: 'Moyenne', class: 'severity-medium' };
    return { label: 'Faible', class: 'severity-low' };
  };

  const severityInfo = getSeverityLabel();

  return (
    <div className="create-alert-container">
      {/* Back Link */}
      <Link to="/alertes" className="back-link">
        <ArrowLeft size={18} />
        Retour aux alertes
      </Link>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Créer une Alerte</h1>
          <p className="page-subtitle">
            Création manuelle d'une alerte pour un patient
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Patient Selection */}
          <div className="form-section">
            <h3 className="section-title">
              <AlertCircle size={20} />
              Informations Patient
            </h3>
            
            <div className="form-group">
              <label htmlFor="patient" className="form-label">
                Sélectionner un patient *
              </label>
              <select
                id="patient"
                value={formData.patientId}
                onChange={(e) => handleChange('patientId', e.target.value)}
                className="form-select"
                required
              >
                <option value="">-- Choisir un patient --</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alert Details */}
          <div className="form-section">
            <h3 className="section-title">
              <AlertCircle size={20} />
              Détails de l'Alerte
            </h3>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Catégorie d'alerte *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="form-select"
                required
              >
                <option value="medical">Médical</option>
                <option value="cognitive">Cognitif</option>
                <option value="safety">Sécurité</option>
              </select>
              <p className="form-help">
                {formData.category === 'medical' && 'Alertes liées à l\'état de santé général du patient'}
                {formData.category === 'cognitive' && 'Alertes concernant les capacités cognitives et la mémoire'}
                {formData.category === 'safety' && 'Alertes relatives à la sécurité et au bien-être du patient'}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Titre de l'alerte *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="form-input"
                placeholder="Ex: Déclin cognitif détecté"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description détaillée *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="form-textarea"
                placeholder="Décrivez en détail l'alerte et les observations..."
                rows={5}
                required
                maxLength={500}
              />
              <p className="form-help">
                {formData.description.length}/500 caractères
              </p>
            </div>
          </div>

          {/* Severity */}
          <div className="form-section">
            <h3 className="section-title">
              <AlertCircle size={20} />
              Niveau de Sévérité
            </h3>

            <div className="form-group">
              <label htmlFor="severity" className="form-label">
                Sévérité initiale
              </label>
              
              <div className="severity-display">
                <div className={`severity-indicator ${severityInfo.class}`}>
                  <span className="severity-value">{formData.severity}</span>
                  <span className="severity-label">{severityInfo.label}</span>
                </div>
              </div>

              <input
                type="range"
                id="severity"
                min="0"
                max="100"
                value={formData.severity}
                onChange={(e) => handleChange('severity', parseInt(e.target.value))}
                className="severity-slider"
              />

              <div className="severity-scale">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>

              <div className="severity-legend">
                <div className="legend-item">
                  <span className="legend-dot severity-low"></span>
                  <span>0-24: Faible</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot severity-medium"></span>
                  <span>25-49: Moyenne</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot severity-high"></span>
                  <span>50-74: Élevée</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot severity-critical"></span>
                  <span>75-100: Critique</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="form-section">
            <h3 className="section-title">
              <MessageSquare size={20} />
              Notifications
            </h3>

            <div className="notification-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.notifyEmail}
                  onChange={(e) => handleChange('notifyEmail', e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <Mail size={18} />
                  <span>Notifier par email</span>
                </div>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.notifySms}
                  onChange={(e) => handleChange('notifySms', e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <MessageSquare size={18} />
                  <span>Notifier par SMS</span>
                </div>
              </label>
            </div>

            <p className="form-help">
              Les notifications seront envoyées au patient et aux aidants désignés
            </p>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/alertes" className="btn btn-secondary">
              Annuler
            </Link>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Créer l'alerte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
