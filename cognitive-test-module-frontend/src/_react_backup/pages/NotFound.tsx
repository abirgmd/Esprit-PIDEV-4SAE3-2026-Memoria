import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page non trouvée</h2>
        <p className="not-found-message">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={20} />
            Retour à l'accueil
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={20} />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}
