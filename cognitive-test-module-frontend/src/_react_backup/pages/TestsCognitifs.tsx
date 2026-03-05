import { Brain, MessageSquare, Compass, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import './TestsCognitifs.css';

export function TestsCognitifs() {
  const navigate = useNavigate();
  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');

  const patients = [
    { id: '1', name: 'Marie Dubois' },
    { id: '2', name: 'Jean Martin' },
    { id: '3', name: 'Sophie Laurent' },
    { id: '4', name: 'Pierre Durand' },
  ];

  const testCategories = [
    {
      id: 'memoire',
      title: 'Tests de Mémoire',
      description: 'Évaluation de la mémoire à court et long terme',
      icon: Brain,
      color: 'blue',
      count: 12,
      link: '/tests-cognitifs/memoire'
    },
    {
      id: 'langage',
      title: 'Tests de Langage',
      description: 'Évaluation des capacités linguistiques et de communication',
      icon: MessageSquare,
      color: 'green',
      count: 8,
      link: '/tests-cognitifs/langage'
    },
    {
      id: 'orientation',
      title: "Tests d'Orientation",
      description: 'Évaluation de l\'orientation spatiale et temporelle',
      icon: Compass,
      color: 'orange',
      count: 6,
      link: '/tests-cognitifs/orientation'
    }
  ];

  const recentTests = [
    {
      patient: 'Marie Dubois',
      test: 'MMSE',
      date: '2024-02-01',
      score: 24,
      duration: '15 min'
    },
    {
      patient: 'Jean Martin',
      test: 'Test des 5 mots',
      date: '2024-01-28',
      score: 8,
      duration: '10 min'
    },
    {
      patient: 'Sophie Laurent',
      test: 'MMSE',
      date: '2024-02-02',
      score: 18,
      duration: '20 min'
    }
  ];

  const handleCloseModal = () => {
    setShowNewTestModal(false);
    // Réinitialiser les sélections après la fermeture
    setTimeout(() => {
      setSelectedPatient('');
      setSelectedTestType('');
    }, 300); // Délai pour l'animation de fermeture
  };

  const handleStartNewTest = () => {
    if (selectedPatient && selectedTestType) {
      // Naviguer vers la page du test approprié
      navigate(`/tests-cognitifs/${selectedTestType}`, { 
        state: { patientId: selectedPatient } 
      });
      // Réinitialiser les sélections
      setSelectedPatient('');
      setSelectedTestType('');
      setShowNewTestModal(false);
    }
  };

  // Fermer le modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showNewTestModal) {
        handleCloseModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showNewTestModal]);

  return (
    <div className="tests-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tests Cognitifs</h1>
          <p className="page-subtitle">Administrez et suivez les tests d'évaluation cognitive</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewTestModal(true)}>
          <Plus size={20} />
          Nouveau test
        </button>
      </div>

      {/* Modal Nouveau Test */}
      {showNewTestModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nouveau Test Cognitif</h2>
              <button 
                className="modal-close" 
                onClick={handleCloseModal}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="patient-select" className="form-label">
                  Sélectionner un patient
                </label>
                <select 
                  id="patient-select"
                  className="form-select"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">Choisir un patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="test-select" className="form-label">
                  Type de test
                </label>
                <select 
                  id="test-select"
                  className="form-select"
                  value={selectedTestType}
                  onChange={(e) => setSelectedTestType(e.target.value)}
                >
                  <option value="">Choisir un type de test...</option>
                  <option value="memoire">Test de Mémoire (MMSE)</option>
                  <option value="langage">Test de Langage</option>
                  <option value="orientation">Test d'Orientation</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleStartNewTest}
                disabled={!selectedPatient || !selectedTestType}
              >
                Démarrer le test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Categories */}
      <div className="test-categories-grid">
        {testCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              to={category.link}
              className={`test-category-card test-category-${category.color}`}
            >
              <div className="category-icon">
                <Icon size={32} />
              </div>
              <div className="category-content">
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
                <p className="category-count">{category.count} tests disponibles</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Tests */}
      <div className="recent-tests-section">
        <h2 className="section-title">Tests récents</h2>
        <div className="table-card">
          <table className="recent-tests-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Test</th>
                <th>Date</th>
                <th>Score</th>
                <th>Durée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTests.map((test, index) => (
                <tr key={index}>
                  <td className="patient-cell">{test.patient}</td>
                  <td>{test.test}</td>
                  <td>{new Date(test.date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className="score-badge">{test.score}</span>
                  </td>
                  <td>{test.duration}</td>
                  <td>
                    <button 
                      className="btn btn-sm"
                      onClick={() => alert(`Détails du test pour ${test.patient}`)}
                    >
                      Voir résultats
                    </button>
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