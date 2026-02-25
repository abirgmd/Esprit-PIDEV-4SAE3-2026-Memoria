import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  Brain, 
  BarChart3, 
  Bell, 
  Users, 
  MessageCircle, 
  Settings,
  ChevronDown,
  ChevronRight,
  Calendar,
  Stethoscope,
  Shield,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  children?: { path: string; label: string }[];
}

export function Sidebar() {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['/tests-cognitifs']);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      path: '/tests-cognitifs',
      label: 'Tests cognitifs',
      icon: <Brain size={20} />,
      children: [
        { path: '/tests-cognitifs/memoire', label: 'Tests mémoire' },
        { path: '/tests-cognitifs/langage', label: 'Tests langage' },
        { path: '/tests-cognitifs/orientation', label: "Tests d'orientation" }
      ]
    },
    {
      path: '/diagnosis',
      label: 'Diagnostic',
      icon: <Stethoscope size={20} />,
      children: [
        { path: '/diagnosis', label: 'Dashboard' },
        { path: '/diagnosis/create', label: 'Nouveau test' }
      ]
    },
    {
      path: '/treatment',
      label: 'Traitement',
      icon: <Shield size={20} />,
      children: [
        { path: '/treatment', label: 'Dashboard' },
        { path: '/treatment/zones/create', label: 'Créer une zone' },
        { path: '/treatment/tracking', label: 'Tracking GPS' }
      ]
    },
    {
      path: '/analyses',
      label: 'Analyses',
      icon: <BarChart3 size={20} />
    },
    {
      path: '/alertes',
      label: 'Alertes',
      icon: <Bell size={20} />,
      children: [
        { path: '/alertes', label: 'Dashboard' },
        { path: '/alertes/create', label: 'Créer une alerte' },
        { path: '/alertes/reports', label: 'Rapports' }
      ]
    },
    {
      path: '/planning',
      label: 'Planning',
      icon: <Calendar size={20} />,
      children: [
        { path: '/planning/calendar', label: 'Calendrier' },
        { path: '/planning/scheduling', label: 'Planification' },
        { path: '/planning/tasks', label: 'Tâches' },
        { path: '/planning/availability', label: 'Disponibilités' }
      ]
    },
    {
      path: '/patients',
      label: 'Dossiers patients',
      icon: <Users size={20} />
    },
    {
      path: '/communaute',
      label: 'Communauté',
      icon: <MessageCircle size={20} />,
      children: [
        { path: '/communaute', label: 'Communautés' },
        { path: '/communaute/analytics', label: 'Analytics' }
      ]
    },
    {
      path: '/activites',
      label: 'Activités',
      icon: <Activity size={20} />
    },
    {
      path: '/parametres',
      label: 'Paramètres',
      icon: <Settings size={20} />
    }
  ];

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const isExpanded = (path: string) => expandedMenus.includes(path);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Brain size={32} strokeWidth={2.5} />
          </div>
          <h1 className="logo-text">Memoria</h1>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Navigation principale">
          <p className="nav-section-title">Navigation</p>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                {item.children ? (
                  <>
                    <div className="nav-link-wrapper">
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? 'nav-link-active' : ''}`
                        }
                        onClick={() => setMobileOpen(false)}
                        end
                      >
                        <span className="nav-link-content">
                          <span className="nav-icon">{item.icon}</span>
                          <span className="nav-label">{item.label}</span>
                        </span>
                      </NavLink>
                      <button
                        className="nav-expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(item.path);
                        }}
                        aria-expanded={isExpanded(item.path)}
                        aria-label={`${isExpanded(item.path) ? 'Fermer' : 'Ouvrir'} le sous-menu ${item.label}`}
                      >
                        {isExpanded(item.path) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    </div>
                    {isExpanded(item.path) && (
                      <ul className="nav-submenu">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `nav-link nav-link-child ${isActive ? 'nav-link-active' : ''}`
                              }
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                    end={item.path === '/'}
                  >
                    <span className="nav-link-content">
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile toggle button */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <LayoutDashboard size={24} />
      </button>
    </>
  );
}