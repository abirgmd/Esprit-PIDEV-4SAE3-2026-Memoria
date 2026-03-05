import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
import './Parametres.css';

export function Parametres() {
  return (
    <div className="parametres-container">
      <h1 className="page-title">Paramètres</h1>

      <div className="settings-sections">
        <div className="settings-card">
          <div className="settings-header">
            <User size={24} />
            <h2 className="settings-title">Profil utilisateur</h2>
          </div>
          <div className="settings-body">
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input type="text" className="form-input" defaultValue="Dr. Martin" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" defaultValue="dr.martin@memoria.fr" />
            </div>
            <div className="form-group">
              <label className="form-label">Spécialité</label>
              <input type="text" className="form-input" defaultValue="Médecin généraliste" />
            </div>
            <button className="btn btn-primary">Enregistrer les modifications</button>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-header">
            <Bell size={24} />
            <h2 className="settings-title">Notifications</h2>
          </div>
          <div className="settings-body">
            <div className="setting-item">
              <div>
                <p className="setting-item-title">Alertes critiques</p>
                <p className="setting-item-desc">Recevoir des notifications pour les alertes critiques</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div>
                <p className="setting-item-title">Rappels de rendez-vous</p>
                <p className="setting-item-desc">Notifications 24h avant les rendez-vous</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-header">
            <Palette size={24} />
            <h2 className="settings-title">Apparence</h2>
          </div>
          <div className="settings-body">
            <div className="setting-item">
              <div>
                <p className="setting-item-title">Mode contraste élevé</p>
                <p className="setting-item-desc">Pour une meilleure lisibilité</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div>
                <p className="setting-item-title">Texte agrandi</p>
                <p className="setting-item-desc">Augmenter la taille du texte</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
