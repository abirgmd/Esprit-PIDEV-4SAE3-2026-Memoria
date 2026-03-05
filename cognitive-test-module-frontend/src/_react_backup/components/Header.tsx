import { Search, Bell, Mail, User } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);
  const [messageCount] = useState(2);

  return (
    <header className="main-header">
      {/* Search bar */}
      <div className="header-search">
        <Search size={20} className="search-icon" />
        <input
          type="search"
          placeholder="Rechercher un patient, un test..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          aria-label="Rechercher"
        />
      </div>

      {/* Actions */}
      <div className="header-actions">
        {/* Notifications */}
        <button className="header-action-btn" aria-label="Notifications">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="badge badge-accent">{notificationCount}</span>
          )}
        </button>

        {/* Messages */}
        <button className="header-action-btn" aria-label="Messages">
          <Mail size={20} />
          {messageCount > 0 && (
            <span className="badge badge-info">{messageCount}</span>
          )}
        </button>

        {/* User profile */}
        <button className="header-profile" aria-label="Profil utilisateur">
          <div className="profile-avatar">
            <User size={20} />
          </div>
          <div className="profile-info">
            <span className="profile-name">Dr. Martin</span>
            <span className="profile-role">Médecin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
