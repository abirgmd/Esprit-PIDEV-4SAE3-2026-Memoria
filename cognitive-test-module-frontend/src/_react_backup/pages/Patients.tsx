import { Search, Filter, UserPlus, TrendingDown, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router';
import './Patients.css';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastTest: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'surveillance' | 'critique';
  nextAppointment: string;
}

export function Patients() {
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      age: 72,
      lastTest: '2024-02-01',
      score: 24,
      trend: 'down',
      status: 'surveillance',
      nextAppointment: '2024-02-15'
    },
    {
      id: '2',
      name: 'Jean Martin',
      age: 68,
      lastTest: '2024-01-28',
      score: 28,
      trend: 'stable',
      status: 'normal',
      nextAppointment: '2024-03-01'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      age: 75,
      lastTest: '2024-02-02',
      score: 18,
      trend: 'down',
      status: 'critique',
      nextAppointment: '2024-02-08'
    },
    {
      id: '4',
      name: 'Pierre Durand',
      age: 70,
      lastTest: '2024-01-30',
      score: 26,
      trend: 'up',
      status: 'normal',
      nextAppointment: '2024-02-20'
    },
    {
      id: '5',
      name: 'Claire Petit',
      age: 77,
      lastTest: '2024-02-01',
      score: 22,
      trend: 'down',
      status: 'surveillance',
      nextAppointment: '2024-02-12'
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'status-normal';
      case 'surveillance':
        return 'status-surveillance';
      case 'critique':
        return 'status-critique';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Stable';
      case 'surveillance':
        return 'À surveiller';
      case 'critique':
        return 'Critique';
      default:
        return status;
    }
  };

  return (
    <div className="patients-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dossiers Patients</h1>
          <p className="page-subtitle">{patients.length} patients actifs</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={20} />
          Nouveau patient
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="search"
            placeholder="Rechercher un patient..."
            className="search-input-simple"
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={20} />
          Filtres
        </button>
      </div>

      {/* Patients Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Âge</th>
                <th>Dernier test</th>
                <th>Score MMSE</th>
                <th>Tendance</th>
                <th>Statut</th>
                <th>Prochain RDV</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="patient-info">
                      <div className="patient-avatar">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="patient-name">{patient.name}</span>
                    </div>
                  </td>
                  <td>{patient.age} ans</td>
                  <td>{new Date(patient.lastTest).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className="score-badge">{patient.score}/30</span>
                  </td>
                  <td>
                    <div className="trend-indicator">
                      {patient.trend === 'down' && (
                        <TrendingDown size={20} className="trend-down" />
                      )}
                      {patient.trend === 'up' && (
                        <TrendingUp size={20} className="trend-up" />
                      )}
                      {patient.trend === 'stable' && (
                        <span className="trend-stable">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(patient.status)}`}>
                      {getStatusLabel(patient.status)}
                    </span>
                  </td>
                  <td>
                    <div className="appointment-date">
                      <Clock size={16} />
                      {new Date(patient.nextAppointment).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td>
                    <Link to={`/patients/${patient.id}`} className="btn btn-sm">
                      Voir détails
                    </Link>
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
