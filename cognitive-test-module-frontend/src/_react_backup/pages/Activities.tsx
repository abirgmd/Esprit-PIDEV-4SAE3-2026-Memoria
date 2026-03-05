import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Plus,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Eye,
  Smile,
  Brain,
  Music,
  Palette,
  Filter,
  Edit,
  Trash2
} from 'lucide-react';
import './Activities.css';

interface Activity {
  id: string;
  type: 'publication' | 'therapeutic';
  title: string;
  description: string;
  author: string;
  authorRole: string;
  category: string;
  date: string;
  participants?: number;
  maxParticipants?: number;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  status?: 'active' | 'completed' | 'scheduled';
  visibility: 'public' | 'community';
}

export function Activities() {
  const [filter, setFilter] = useState<'all' | 'publication' | 'therapeutic'>('all');
  const [userRole] = useState<'doctor' | 'user'>('doctor');

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'ACT001',
      type: 'therapeutic',
      title: 'Atelier mémoire et musique',
      description: 'Séance de stimulation cognitive par la musique. Écoute de chansons d\'époque et partage de souvenirs associés. Activité douce et conviviale.',
      author: 'Dr. Marie Dubois',
      authorRole: 'Neurologue',
      category: 'cognitive',
      date: '2026-02-06T14:00:00',
      participants: 8,
      maxParticipants: 12,
      likes: 24,
      comments: 7,
      views: 156,
      isLiked: false,
      status: 'scheduled',
      visibility: 'public'
    },
    {
      id: 'ACT002',
      type: 'publication',
      title: '5 exercices quotidiens pour stimuler la mémoire',
      description: 'Article pratique avec des exercices simples à réaliser au quotidien. Basé sur les dernières recherches en neurosciences. Inclut des fiches PDF téléchargeables.',
      author: 'Dr. Sophie Laurent',
      authorRole: 'Gériatre',
      category: 'education',
      date: '2026-02-04T10:30:00',
      likes: 142,
      comments: 28,
      views: 892,
      isLiked: true,
      visibility: 'public'
    },
    {
      id: 'ACT003',
      type: 'therapeutic',
      title: 'Séance d\'art-thérapie créative',
      description: 'Expression artistique libre avec peinture et modelage. Favorise l\'expression émotionnelle et la coordination. Matériel fourni.',
      author: 'Claire Petit',
      authorRole: 'Art-thérapeute',
      category: 'creative',
      date: '2026-02-05T10:00:00',
      participants: 6,
      maxParticipants: 10,
      likes: 31,
      comments: 12,
      views: 234,
      isLiked: true,
      status: 'active',
      visibility: 'community'
    },
    {
      id: 'ACT004',
      type: 'publication',
      title: 'Témoignage: Mon parcours d\'aidant',
      description: 'Partage d\'expérience sur l\'accompagnement d\'un proche atteint d\'Alzheimer. Conseils pratiques et soutien émotionnel.',
      author: 'Jean Martin',
      authorRole: 'Aidant familial',
      category: 'testimonial',
      date: '2026-02-03T16:20:00',
      likes: 89,
      comments: 34,
      views: 567,
      isLiked: false,
      visibility: 'public'
    },
    {
      id: 'ACT005',
      type: 'therapeutic',
      title: 'Gymnastique douce et équilibre',
      description: 'Exercices physiques adaptés pour maintenir la mobilité et prévenir les chutes. Séance encadrée par un kinésithérapeute.',
      author: 'Pierre Durand',
      authorRole: 'Kinésithérapeute',
      category: 'physical',
      date: '2026-02-01T09:00:00',
      participants: 12,
      maxParticipants: 12,
      likes: 45,
      comments: 9,
      views: 287,
      isLiked: false,
      status: 'completed',
      visibility: 'public'
    },
    {
      id: 'ACT006',
      type: 'publication',
      title: 'Nutrition et santé cognitive',
      description: 'Guide nutritionnel avec recettes adaptées. Focus sur les aliments bénéfiques pour le cerveau et la mémoire.',
      author: 'Dr. Anne Bernard',
      authorRole: 'Nutritionniste',
      category: 'health',
      date: '2026-01-30T14:00:00',
      likes: 178,
      comments: 45,
      views: 1234,
      isLiked: true,
      visibility: 'public'
    }
  ]);

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const handleLike = (id: string) => {
    setActivities(activities.map(activity =>
      activity.id === id
        ? { 
            ...activity, 
            isLiked: !activity.isLiked, 
            likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1 
          }
        : activity
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive': return <Brain size={18} />;
      case 'creative': return <Palette size={18} />;
      case 'physical': return <Smile size={18} />;
      case 'education': return <Brain size={18} />;
      default: return <MessageCircle size={18} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'cognitive': 'Cognitif',
      'creative': 'Créatif',
      'physical': 'Physique',
      'education': 'Éducation',
      'testimonial': 'Témoignage',
      'health': 'Santé'
    };
    return labels[category] || category;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const badges: Record<string, { label: string; class: string }> = {
      'scheduled': { label: 'À venir', class: 'status-scheduled' },
      'active': { label: 'En cours', class: 'status-active' },
      'completed': { label: 'Terminée', class: 'status-completed' }
    };
    return badges[status] || null;
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  return (
    <div className="activities-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Activités & Publications</h1>
          <p className="page-subtitle">
            Découvrez les activités thérapeutiques et publications de la communauté
          </p>
        </div>
        {userRole === 'doctor' && (
          <Link to="/activites/create" className="btn btn-primary">
            <Plus size={18} />
            <span>Créer une activité</span>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="activities-stats">
        <div className="stat-card">
          <Calendar size={24} />
          <div>
            <p className="stat-value">
              {activities.filter(a => a.type === 'therapeutic').length}
            </p>
            <p className="stat-label">Activités thérapeutiques</p>
          </div>
        </div>
        <div className="stat-card">
          <MessageCircle size={24} />
          <div>
            <p className="stat-value">
              {activities.filter(a => a.type === 'publication').length}
            </p>
            <p className="stat-label">Publications</p>
          </div>
        </div>
        <div className="stat-card">
          <Users size={24} />
          <div>
            <p className="stat-value">
              {activities
                .filter(a => a.participants)
                .reduce((sum, a) => sum + (a.participants || 0), 0)}
            </p>
            <p className="stat-label">Participants totaux</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="activities-filters">
        <Filter size={18} />
        <button
          className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes
        </button>
        <button
          className={`filter-btn ${filter === 'therapeutic' ? 'filter-btn-active' : ''}`}
          onClick={() => setFilter('therapeutic')}
        >
          Activités thérapeutiques
        </button>
        <button
          className={`filter-btn ${filter === 'publication' ? 'filter-btn-active' : ''}`}
          onClick={() => setFilter('publication')}
        >
          Publications
        </button>
      </div>

      {/* Activities Feed */}
      <div className="activities-feed">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <div className="activity-header">
              <div className="activity-type-badge">
                {activity.type === 'therapeutic' ? (
                  <><Calendar size={16} /> Activité thérapeutique</>
                ) : (
                  <><MessageCircle size={16} /> Publication</>
                )}
              </div>
              {activity.status && (
                <span className={`status-badge ${getStatusBadge(activity.status)?.class}`}>
                  {getStatusBadge(activity.status)?.label}
                </span>
              )}
            </div>

            <h2 className="activity-title">{activity.title}</h2>
            <p className="activity-description">{activity.description}</p>

            <div className="activity-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {activity.author.charAt(0)}
                </div>
                <div>
                  <div className="author-name">{activity.author}</div>
                  <div className="author-role">{activity.authorRole}</div>
                </div>
              </div>
              <div className="category-tag">
                {getCategoryIcon(activity.category)}
                <span>{getCategoryLabel(activity.category)}</span>
              </div>
            </div>

            {activity.type === 'therapeutic' && activity.participants !== undefined && (
              <div className="participants-bar">
                <div className="participants-info">
                  <Users size={16} />
                  <span>{activity.participants}/{activity.maxParticipants} participants</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${((activity.participants || 0) / (activity.maxParticipants || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}

            <div className="activity-footer">
              <div className="activity-stats">
                <div className="stat-item">
                  <Eye size={16} />
                  <span>{activity.views}</span>
                </div>
                <div className="stat-item">
                  <Heart size={16} />
                  <span>{activity.likes}</span>
                </div>
                <div className="stat-item">
                  <MessageCircle size={16} />
                  <span>{activity.comments}</span>
                </div>
              </div>

              <div className="activity-actions">
                <button
                  className={`action-btn ${activity.isLiked ? 'action-liked' : ''}`}
                  onClick={() => handleLike(activity.id)}
                >
                  <Heart size={18} fill={activity.isLiked ? 'currentColor' : 'none'} />
                  <span>J'aime</span>
                </button>
                <button className="action-btn">
                  <MessageCircle size={18} />
                  <span>Commenter</span>
                </button>
                {activity.type === 'therapeutic' && activity.status === 'scheduled' && (
                  <Link to={`/activites/${activity.id}/participate`} className="btn btn-primary btn-sm">
                    Participer
                  </Link>
                )}
                {userRole === 'doctor' && (
                  <div className="admin-actions">
                    <button className="action-btn-icon" title="Modifier">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn-icon action-delete" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="activity-date">
              <Calendar size={14} />
              <span>{formatDate(activity.date)}</span>
              {activity.visibility === 'community' && (
                <span className="visibility-badge">Communauté</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
