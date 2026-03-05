import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, FileText, Activity, AlertCircle, Pill } from 'lucide-react';
import './PatientDetail.css';

export function PatientDetail() {
  const { id } = useParams();

  // Mock patient data
  const patient = {
    id,
    name: 'Marie Dubois',
    age: 72,
    dateOfBirth: '1952-05-15',
    photo: null,
    lastTest: '2024-02-01',
    mmseScore: 24,
    status: 'surveillance',
    medications: [
      { name: 'Donépézil', dosage: '10mg', frequency: '1x/jour' },
      { name: 'Mémantine', dosage: '20mg', frequency: '1x/jour' }
    ],
    history: [
      { date: '2024-02-01', test: 'MMSE', score: 24, notes: 'Légère baisse' },
      { date: '2024-01-01', test: 'MMSE', score: 26, notes: 'Stable' },
      { date: '2023-12-01', test: 'MMSE', score: 26, notes: 'Premier test' }
    ],
    alerts: [
      { type: 'warning', message: 'Baisse de score de 2 points en 1 mois', date: '2024-02-01' }
    ]
  };

  return (
    <div className="patient-detail-container">
      {/* Back button */}
      <Link to="/patients" className="back-link">
        <ArrowLeft size={20} />
        Retour aux patients
      </Link>

      {/* Patient Header */}
      <div className="patient-header-card">
        <div className="patient-identity">
          <div className="patient-photo">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="patient-details">
            <h1 className="patient-detail-name">{patient.name}</h1>
            <p className="patient-meta">
              {patient.age} ans • Né(e) le {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
            </p>
            <span className={`status-badge status-${patient.status}`}>
              {patient.status === 'surveillance' ? 'À surveiller' : 'Normal'}
            </span>
          </div>
        </div>
        <div className="patient-quick-actions">
          <button className="btn btn-primary">
            <Calendar size={20} />
            Planifier RDV
          </button>
          <button className="btn btn-secondary">
            <FileText size={20} />
            Nouveau test
          </button>
        </div>
      </div>

      <div className="patient-content-grid">
        {/* Alerts */}
        {patient.alerts.length > 0 && (
          <div className="info-card alert-card">
            <div className="card-header">
              <h2 className="card-title">
                <AlertCircle size={20} />
                Alertes
              </h2>
            </div>
            <div className="card-body">
              {patient.alerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-icon alert-warning">
                    <AlertCircle size={18} />
                  </div>
                  <div className="alert-content">
                    <p className="alert-message">{alert.message}</p>
                    <p className="alert-date">{new Date(alert.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Score History */}
        <div className="info-card">
          <div className="card-header">
            <h2 className="card-title">
              <Activity size={20} />
              Historique des scores
            </h2>
          </div>
          <div className="card-body">
            <div className="score-timeline">
              {patient.history.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-date">
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="timeline-score">{item.score}/30</span>
                    </div>
                    <p className="timeline-test">{item.test}</p>
                    <p className="timeline-notes">{item.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="info-card">
          <div className="card-header">
            <h2 className="card-title">
              <Pill size={20} />
              Traitements en cours
            </h2>
          </div>
          <div className="card-body">
            <div className="medications-list">
              {patient.medications.map((med, index) => (
                <div key={index} className="medication-item">
                  <div className="medication-icon">
                    <Pill size={18} />
                  </div>
                  <div className="medication-info">
                    <p className="medication-name">{med.name}</p>
                    <p className="medication-dosage">
                      {med.dosage} • {med.frequency}
                    </p>
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
