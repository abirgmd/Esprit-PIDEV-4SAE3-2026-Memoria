import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import './TestMemoire.css';

interface Question {
  id: number;
  question: string;
  type: 'choice' | 'open';
  options?: string[];
  correctAnswer?: number;
}

export function TestLangage() {
  const location = useLocation();
  const patientId = location.state?.patientId;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Timer
  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isComplete]);

  const questions: Question[] = [
    {
      id: 1,
      question: "Nommez cet objet (montrer un stylo)",
      type: 'choice',
      options: ['Crayon', 'Stylo', 'Marqueur', 'Plume'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Nommez cet objet (montrer une montre)",
      type: 'choice',
      options: ['Horloge', 'Montre', 'Chronomètre', 'Pendule'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Répétez cette phrase : 'Pas de mais, ni de si, ni de et'",
      type: 'open'
    },
    {
      id: 4,
      question: "Lisez et exécutez : 'FERMEZ LES YEUX'",
      type: 'choice',
      options: ['Exécuté correctement', 'Hésitation', 'Erreur', 'Refus'],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Écrivez une phrase complète",
      type: 'open'
    }
  ];

  const handleAnswer = (answer: number | string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isComplete) {
    return (
      <div className="test-container">
        <div className="test-complete">
          <div className="complete-icon">
            <CheckCircle size={64} />
          </div>
          <h1 className="complete-title">Test terminé !</h1>
          <p className="complete-message">
            Le test de langage a été complété avec succès.
            {patientId && ` Les résultats ont été enregistrés pour le patient sélectionné.`}
          </p>
          <div className="complete-stats">
            <div className="stat-item">
              <span className="stat-label">Questions répondues</span>
              <span className="stat-value">{answers.length}/{questions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Temps écoulé</span>
              <span className="stat-value">{Math.floor(timeElapsed / 60)}min {timeElapsed % 60}s</span>
            </div>
          </div>
          <div className="complete-actions">
            <Link to="/tests-cognitifs" className="btn btn-primary">
              Retour aux tests
            </Link>
            <button className="btn btn-secondary" onClick={() => {
              setCurrentQuestion(0);
              setAnswers([]);
              setIsComplete(false);
              setTimeElapsed(0);
            }}>
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="test-container">
      <Link to="/tests-cognitifs" className="back-link">
        <ArrowLeft size={20} />
        Retour aux tests cognitifs
      </Link>

      <div className="test-card">
        {/* Header */}
        <div className="test-header">
          <div className="test-info">
            <h1 className="test-title">Test de Langage</h1>
            <p className="test-subtitle">
              Question {currentQuestion + 1} sur {questions.length}
            </p>
          </div>
          <div className="test-timer">
            <Clock size={20} />
            <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="test-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{Math.round(progress)}% complété</span>
        </div>

        {/* Question */}
        <div className="test-question-area">
          <h2 className="question-text">{question.question}</h2>

          {question.type === 'choice' && question.options && (
            <div className="answer-options">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${answers[currentQuestion] === index ? 'option-selected' : ''}`}
                  onClick={() => handleAnswer(index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          )}

          {question.type === 'open' && (
            <div className="answer-open">
              <textarea
                className="answer-textarea"
                placeholder="Tapez votre réponse ici..."
                value={answers[currentQuestion] as string || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                rows={4}
              />
              <p className="answer-hint">
                Note : Cette réponse sera évaluée manuellement par le médecin
              </p>
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
            Précédent
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
          >
            {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>

      {/* Instructions sidebar */}
      <div className="test-instructions">
        <h3 className="instructions-title">Instructions</h3>
        <ul className="instructions-list">
          <li>Administrez le test au patient</li>
          <li>Prenez note de ses réponses</li>
          <li>Encouragez le patient calmement</li>
          <li>Ne corrigez pas ses erreurs</li>
          <li>Respectez le rythme du patient</li>
        </ul>
      </div>
    </div>
  );
}
