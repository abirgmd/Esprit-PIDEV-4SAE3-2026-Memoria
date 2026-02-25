import { BarChart3, FileText, Download } from 'lucide-react';
import './Analyses.css';

export function Analyses() {
  return (
    <div className="analyses-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analyses & Rapports</h1>
          <p className="page-subtitle">Visualisez et exportez les données d'analyse</p>
        </div>
        <button className="btn btn-primary">
          <Download size={20} />
          Exporter les données
        </button>
      </div>

      <div className="analyses-grid">
        <div className="analysis-card">
          <div className="analysis-icon">
            <BarChart3 size={32} />
          </div>
          <h3 className="analysis-title">Graphiques & Tendances</h3>
          <p className="analysis-description">
            Visualisez l'évolution des scores cognitifs dans le temps
          </p>
          <button className="btn btn-secondary">Voir les graphiques</button>
        </div>

        <div className="analysis-card">
          <div className="analysis-icon">
            <FileText size={32} />
          </div>
          <h3 className="analysis-title">Rapports détaillés</h3>
          <p className="analysis-description">
            Générez des rapports complets pour chaque patient
          </p>
          <button className="btn btn-secondary">Générer un rapport</button>
        </div>
      </div>
    </div>
  );
}
