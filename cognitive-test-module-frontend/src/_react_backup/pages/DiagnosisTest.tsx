import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import './DiagnosisTest.css';

interface Question {
  id: number;
  category: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'drawing';
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

export function DiagnosisTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const testInfo = {
    id: id || 'DIA001',
    patientName: 'Sophie Laurent',
    testType: 'MMSE',
    totalQuestions: 11,
    maxScore: 30
  };

  const questions: Question[] = [
    {
      id: 1,
      category: 'Orientation temporelle',
      question: 'Quelle est la date complète d\'aujourd\'hui ?',
      type: 'text',
      points: 5
    },
    {
      id: 2,
      category: 'Orientation spatiale',
      question: 'Où sommes-nous actuellement ?',
      type: 'multiple-choice',
      options: ['À l\'hôpital', 'À la maison', 'Dans un cabinet médical', 'Dans un centre de soins'],
      correctAnswer: 0,
      points: 5
    },
    {
      id: 3,
      category: 'Apprentissage',
      question: 'Répétez ces trois mots : CITRON - CLÉ - BALLON',
      type: 'text',
      points: 3
    },
    {
      id: 4,
      category: 'Attention et calcul',
      question: 'Comptez à rebours de 100 en retirant 7 à chaque fois (5 fois)',
      type: 'text',
      points: 5
    },
    {
      id: 5,
      category: 'Rappel',
      question: 'Rappelez-vous les trois mots de tout à l\'heure',
      type: 'text',
      points: 3
    },
    {
      id: 6,
      category: 'Langage',
      question: 'Comment appelez-vous cet objet ? (Montrer un stylo)',
      type: 'text',
      points: 1
    },
    {
      id: 7,
      category: 'Langage',
      question: 'Comment appelez-vous cet objet ? (Montrer une montre)',
      type: 'text',
      points: 1
    },
    {
      id: 8,
      category: 'Langage',
      question: 'Répétez la phrase : "Pas de mais, de si, ni de et"',
      type: 'text',
      points: 1
    },
    {
      id: 9,
      category: 'Compréhension',
      question: 'Prenez cette feuille avec votre main droite, pliez-la en deux et posez-la par terre',
      type: 'multiple-choice',
      options: [
        'Toutes les étapes réalisées correctement',
        '2 étapes sur 3 réalisées',
        '1 étape sur 3 réalisée',
        'Aucune étape réalisée'
      ],
      correctAnswer: 0,
      points: 3
    },
    {
      id: 10,
      category: 'Lecture',
      question: 'Lisez et exécutez : "FERMEZ LES YEUX"',
      type: 'multiple-choice',
      options: ['Exécuté correctement', 'Non exécuté'],
      correctAnswer: 0,
      points: 1
    },
    {
      id: 11,
      category: 'Dessin',
      question: 'Copiez ce dessin (deux pentagones entrecroisés)',
      type: 'multiple-choice',
      options: ['Copie correcte', 'Copie partielle', 'Copie incorrecte'],
      correctAnswer: 0,
      points: 1
    }
  ];

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: any) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsRunning(false);
    // Calculate score (simplified)
    const score = Object.keys(answers).length * 2; // Mock calculation
    navigate(`/diagnosis/${id}/results`);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="diagnosis-test-container">
      {/* Header */}
      <div className="test-header">
        <Link to="/diagnosis" className="btn btn-secondary btn-icon">
          <ArrowLeft size={20} />
        </Link>
        <div className="test-info">
          <h1 className="test-title">{testInfo.testType}</h1>
          <p className="test-patient">Patient : {testInfo.patientName}</p>
        </div>
        <div className="test-timer">
          <Clock size={20} />
          <span className="timer-value">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span>Question {currentQuestion + 1} sur {questions.length}</span>
          <span>{answeredCount} réponses enregistrées</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <div className="question-category">
          {questions[currentQuestion].category}
          <span className="question-points">
            {questions[currentQuestion].points} {questions[currentQuestion].points > 1 ? 'points' : 'point'}
          </span>
        </div>

        <h2 className="question-text">
          {questions[currentQuestion].question}
        </h2>

        {/* Answer Section */}
        <div className="answer-section">
          {questions[currentQuestion].type === 'multiple-choice' && (
            <div className="options-list">
              {questions[currentQuestion].options?.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${answers[currentQuestion] === index ? 'option-selected' : ''}`}
                  onClick={() => handleAnswer(index)}
                >
                  <div className="option-radio">
                    {answers[currentQuestion] === index && (
                      <div className="option-radio-dot" />
                    )}
                  </div>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}

          {questions[currentQuestion].type === 'text' && (
            <div className="text-answer">
              <label className="input-label">
                Réponse du patient (notez exactement ce qui est dit)
              </label>
              <textarea
                className="answer-textarea"
                rows={4}
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Saisissez la réponse du patient..."
              />
            </div>
          )}

          {questions[currentQuestion].type === 'drawing' && (
            <div className="drawing-answer">
              <div className="drawing-placeholder">
                <Palette size={48} />
                <p>Zone de dessin (fonctionnalité à implémenter)</p>
              </div>
            </div>
          )}
        </div>

        {/* Answer Indicator */}
        {answers[currentQuestion] !== undefined && (
          <div className="answer-indicator">
            <CheckCircle size={18} />
            <span>Réponse enregistrée</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="test-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft size={18} />
          <span>Précédent</span>
        </button>

        <div className="question-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-dot ${index === currentQuestion ? 'dot-current' : ''} ${answers[index] !== undefined ? 'dot-answered' : ''}`}
              onClick={() => setCurrentQuestion(index)}
              title={`Question ${index + 1}`}
            >
              {answers[index] !== undefined && <CheckCircle size={12} />}
            </button>
          ))}
        </div>

        {currentQuestion < questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
          >
            <span>Suivant</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={answeredCount < questions.length}
          >
            <CheckCircle size={18} />
            <span>Terminer le test</span>
          </button>
        )}
      </div>

      {/* Warning for incomplete test */}
      {currentQuestion === questions.length - 1 && answeredCount < questions.length && (
        <div className="warning-banner">
          <AlertCircle size={18} />
          <span>
            Attention : {questions.length - answeredCount} question(s) non répondue(s). 
            Veuillez compléter toutes les questions avant de terminer.
          </span>
        </div>
      )}
    </div>
  );
}
