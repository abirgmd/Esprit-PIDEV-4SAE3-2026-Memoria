import { Users, MessageCircle, Heart } from 'lucide-react';
import './Communaute.css';

export function Communaute() {
  const posts = [
    {
      id: 1,
      author: 'Dr. Sophie Martin',
      role: 'Neurologue',
      content: 'Nouveau protocole de tests cognitifs disponible. N\'hésitez pas à partager vos retours d\'expérience.',
      date: '2024-02-02',
      likes: 12,
      comments: 5
    },
    {
      id: 2,
      author: 'Dr. Pierre Durand',
      role: 'Gériatre',
      content: 'Recherche collaboration pour étude sur l\'efficacité des thérapies non-médicamenteuses.',
      date: '2024-02-01',
      likes: 8,
      comments: 3
    }
  ];

  return (
    <div className="communaute-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Communauté</h1>
          <p className="page-subtitle">Échangez avec d'autres professionnels de santé</p>
        </div>
        <button className="btn btn-primary">Nouvelle publication</button>
      </div>

      <div className="community-stats">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <p className="stat-value">156</p>
            <p className="stat-label">Membres actifs</p>
          </div>
        </div>
        <div className="stat-card">
          <MessageCircle size={24} />
          <div>
            <p className="stat-value">342</p>
            <p className="stat-label">Discussions</p>
          </div>
        </div>
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-author">
              <div className="author-avatar">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="author-info">
                <p className="author-name">{post.author}</p>
                <p className="author-role">{post.role}</p>
              </div>
              <span className="post-date">
                {new Date(post.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-actions">
              <button className="post-action-btn">
                <Heart size={18} />
                <span>{post.likes}</span>
              </button>
              <button className="post-action-btn">
                <MessageCircle size={18} />
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
