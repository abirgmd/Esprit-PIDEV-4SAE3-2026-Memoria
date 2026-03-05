import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  UserMinus
} from 'lucide-react';
import './CommunityList.css';

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  activityScore: number;
  createdAt: string;
  isJoined: boolean;
  isPublic: boolean;
  moderator: string;
  tags: string[];
}

export function CommunityList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userRole] = useState<'admin' | 'user'>('admin'); // Mock user role

  const communities: Community[] = [
    {
      id: 'C001',
      name: 'Aidants Alzheimer France',
      description: 'Groupe de soutien pour les aidants familiaux. Partage d\'expériences, conseils pratiques et entraide.',
      category: 'support',
      memberCount: 248,
      activityScore: 92,
      createdAt: '2025-11-15',
      isJoined: true,
      isPublic: true,
      moderator: 'Dr. Sophie Laurent',
      tags: ['aidants', 'soutien', 'famille']
    },
    {
      id: 'C002',
      name: 'Activités thérapeutiques',
      description: 'Partage d\'activités cognitives et ludiques pour stimuler la mémoire et maintenir l\'autonomie.',
      category: 'therapeutic',
      memberCount: 156,
      activityScore: 88,
      createdAt: '2025-12-01',
      isJoined: true,
      isPublic: true,
      moderator: 'Dr. Marie Dubois',
      tags: ['activités', 'thérapie', 'stimulation']
    },
    {
      id: 'C003',
      name: 'Nutrition et Alzheimer',
      description: 'Conseils nutritionnels adaptés, recettes santé et recommandations diététiques pour les patients.',
      category: 'education',
      memberCount: 134,
      activityScore: 76,
      createdAt: '2026-01-10',
      isJoined: false,
      isPublic: true,
      moderator: 'Dr. Jean Martin',
      tags: ['nutrition', 'santé', 'alimentation']
    },
    {
      id: 'C004',
      name: 'Professionnels de santé',
      description: 'Espace d\'échange réservé aux médecins, infirmiers et professionnels de santé.',
      category: 'professional',
      memberCount: 89,
      activityScore: 94,
      createdAt: '2025-10-20',
      isJoined: true,
      isPublic: false,
      moderator: 'Dr. Claire Petit',
      tags: ['médecins', 'professionnel', 'recherche']
    },
    {
      id: 'C005',
      name: 'Témoignages et parcours',
      description: 'Histoires vécues, témoignages de patients et familles, parcours de soins.',
      category: 'support',
      memberCount: 312,
      activityScore: 85,
      createdAt: '2025-09-05',
      isJoined: false,
      isPublic: true,
      moderator: 'Dr. Anne Bernard',
      tags: ['témoignages', 'parcours', 'vécu']
    },
    {
      id: 'C006',
      name: 'Innovations et recherche',
      description: 'Dernières avancées scientifiques, nouvelles thérapies et technologies innovantes.',
      category: 'education',
      memberCount: 97,
      activityScore: 71,
      createdAt: '2026-01-28',
      isJoined: false,
      isPublic: true,
      moderator: 'Dr. Pierre Durand',
      tags: ['recherche', 'innovation', 'science']
    }
  ];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'support': 'Soutien',
      'therapeutic': 'Thérapeutique',
      'education': 'Éducation',
      'professional': 'Professionnel'
    };
    return labels[category] || category;
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateStr));
  };

  return (
    <div className="community-list-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Communautés</h1>
          <p className="page-subtitle">
            Rejoignez et participez aux groupes de soutien et d'échange
          </p>
        </div>
        {userRole === 'admin' && (
          <Link to="/communaute/create" className="btn btn-primary">
            <Plus size={18} />
            <span>Créer une communauté</span>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="community-stats">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <p className="stat-value">{communities.length}</p>
            <p className="stat-label">Communautés</p>
          </div>
        </div>
        <div className="stat-card">
          <UserPlus size={24} />
          <div>
            <p className="stat-value">{communities.filter(c => c.isJoined).length}</p>
            <p className="stat-label">Mes groupes</p>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} />
          <div>
            <p className="stat-value">
              {Math.round(communities.reduce((sum, c) => sum + c.activityScore, 0) / communities.length)}%
            </p>
            <p className="stat-label">Activité moyenne</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="community-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher une communauté..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les catégories</option>
            <option value="support">Soutien</option>
            <option value="therapeutic">Thérapeutique</option>
            <option value="education">Éducation</option>
            <option value="professional">Professionnel</option>
          </select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="communities-grid">
        {filteredCommunities.map((community) => (
          <div key={community.id} className="community-card">
            <div className="community-card-header">
              <div className="community-icon">
                <Users size={28} />
              </div>
              <div className="community-badge-group">
                <span className={`category-badge category-${community.category}`}>
                  {getCategoryLabel(community.category)}
                </span>
                {!community.isPublic && (
                  <span className="private-badge">Privé</span>
                )}
              </div>
            </div>

            <h3 className="community-name">{community.name}</h3>
            <p className="community-description">{community.description}</p>

            <div className="community-tags">
              {community.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="community-stats-row">
              <div className="stat-item">
                <Users size={16} />
                <span>{community.memberCount} membres</span>
              </div>
              <div className="stat-item">
                <TrendingUp size={16} />
                <span>{community.activityScore}% actif</span>
              </div>
            </div>

            <div className="community-meta">
              <span className="moderator">
                Modéré par {community.moderator}
              </span>
              <span className="created-date">
                Créée le {formatDate(community.createdAt)}
              </span>
            </div>

            <div className="community-actions">
              {community.isJoined ? (
                <>
                  <Link to={`/communaute/${community.id}`} className="btn btn-primary btn-sm">
                    <MessageCircle size={16} />
                    <span>Voir les discussions</span>
                  </Link>
                  <button className="btn btn-secondary btn-sm">
                    <UserMinus size={16} />
                    <span>Quitter</span>
                  </button>
                </>
              ) : (
                <button className="btn btn-primary btn-sm btn-full">
                  <UserPlus size={16} />
                  <span>Rejoindre</span>
                </button>
              )}

              {userRole === 'admin' && (
                <div className="admin-actions">
                  <button className="action-btn action-edit" title="Modifier">
                    <Edit size={16} />
                  </button>
                  <button className="action-btn action-delete" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="empty-state">
          <Users size={48} />
          <p>Aucune communauté ne correspond à votre recherche</p>
        </div>
      )}
    </div>
  );
}
