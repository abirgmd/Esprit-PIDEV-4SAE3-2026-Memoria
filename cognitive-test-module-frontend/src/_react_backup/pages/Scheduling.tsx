import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Clock, User, Save, Bell } from 'lucide-react';
import './Scheduling.css';

interface Patient {
  id: string;
  name: string;
}

export function Scheduling() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    eventType: 'appointment',
    title: '',
    description: '',
    date: '2026-02-05',
    time: '10:00',
    duration: 30,
    location: '',
    reminder: true,
    reminderTime: 30
  });

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
    console.log('Scheduling event:', formData);
    alert('Événement planifié avec succès !');
    navigate('/planning/calendar');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="scheduling-container">
      <Link to="/planning/calendar" className="back-link">
        <ArrowLeft size={18} />
        Retour au calendrier
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">Planifier un Événement</h1>
          <p className="page-subtitle">
            Créer un nouveau rendez-vous ou événement
          </p>
        </div>
      </div>

      <div className="scheduling-layout">
        {/* Main Form */}
        <div className="scheduling-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">
                <User size={20} />
                Patient
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
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <Calendar size={20} />
                Détails de l'Événement
              </h3>

              <div className="form-group">
                <label htmlFor="eventType" className="form-label">
                  Type d'événement *
                </label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleChange('eventType', e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="appointment">Rendez-vous</option>
                  <option value="test">Test cognitif</option>
                  <option value="reminder">Rappel</option>
                  <option value="task">Tâche</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Titre *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="form-input"
                  placeholder="Ex: Consultation de suivi"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="form-textarea"
                  placeholder="Notes ou informations complémentaires..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Lieu
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="form-input"
                  placeholder="Ex: Cabinet médical, Salle 203"
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <Clock size={20} />
                Date et Heure
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date" className="form-label">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time" className="form-label">
                    Heure *
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration" className="form-label">
                    Durée (min) *
                  </label>
                  <select
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                    className="form-select"
                    required
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <Bell size={20} />
                Rappel
              </h3>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.reminder}
                  onChange={(e) => handleChange('reminder', e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Activer le rappel</span>
              </label>

              {formData.reminder && (
                <div className="form-group reminder-time">
                  <label htmlFor="reminderTime" className="form-label">
                    Rappel avant l'événement
                  </label>
                  <select
                    id="reminderTime"
                    value={formData.reminderTime}
                    onChange={(e) => handleChange('reminderTime', parseInt(e.target.value))}
                    className="form-select"
                  >
                    <option value="15">15 minutes avant</option>
                    <option value="30">30 minutes avant</option>
                    <option value="60">1 heure avant</option>
                    <option value="120">2 heures avant</option>
                    <option value="1440">1 jour avant</option>
                  </select>
                </div>
              )}
            </div>

            <div className="form-actions">
              <Link to="/planning/calendar" className="btn btn-secondary">
                Annuler
              </Link>
              <button type="submit" className="btn btn-primary">
                <Save size={18} />
                Enregistrer
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="scheduling-preview">
          <h3 className="preview-title">Aperçu</h3>
          
          <div className="preview-card">
            <div className={`preview-type-badge type-${formData.eventType}`}>
              {formData.eventType === 'appointment' && 'Rendez-vous'}
              {formData.eventType === 'test' && 'Test'}
              {formData.eventType === 'reminder' && 'Rappel'}
              {formData.eventType === 'task' && 'Tâche'}
            </div>

            <div className="preview-content">
              <h4 className="preview-event-title">
                {formData.title || 'Titre de l\'événement'}
              </h4>

              <div className="preview-item">
                <User size={16} />
                <span>
                  {formData.patientId 
                    ? patients.find(p => p.id === formData.patientId)?.name 
                    : 'Patient non sélectionné'}
                </span>
              </div>

              <div className="preview-item">
                <Calendar size={16} />
                <span>
                  {new Date(formData.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="preview-item">
                <Clock size={16} />
                <span>
                  {formData.time} ({formData.duration} minutes)
                </span>
              </div>

              {formData.location && (
                <div className="preview-item">
                  <Calendar size={16} />
                  <span>{formData.location}</span>
                </div>
              )}

              {formData.description && (
                <div className="preview-description">
                  <p className="preview-label">Description:</p>
                  <p>{formData.description}</p>
                </div>
              )}

              {formData.reminder && (
                <div className="preview-reminder">
                  <Bell size={16} />
                  <span>
                    Rappel {formData.reminderTime < 60 
                      ? `${formData.reminderTime} minutes` 
                      : formData.reminderTime < 1440
                        ? `${formData.reminderTime / 60} heure(s)`
                        : '1 jour'
                    } avant
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="preview-tips">
            <h4>💡 Conseils</h4>
            <ul>
              <li>Vérifiez la disponibilité avant de confirmer</li>
              <li>Prévoyez du temps de préparation si nécessaire</li>
              <li>Activez les rappels pour ne pas oublier</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
