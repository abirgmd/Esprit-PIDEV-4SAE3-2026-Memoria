import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { 
  ArrowLeft,
  Send,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Flag,
  Globe,
  Volume2,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  MoreVertical
} from 'lucide-react';
import './CommunityFeed.css';

interface Message {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  isModerated: boolean;
  moderationNote?: string;
  isTranslated: boolean;
  originalLanguage?: string;
  hasVoice: boolean;
}

export function CommunityFeed() {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Mock community data
  const community = {
    id: id || 'C001',
    name: 'Aidants Alzheimer France',
    memberCount: 248,
    description: 'Groupe de soutien pour les aidants familiaux'
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'M001',
      author: 'Sophie Laurent',
      authorRole: 'Aidant',
      content: 'Bonjour à tous, je partage avec vous une activité que ma mère apprécie beaucoup : regarder ensemble nos albums photo. Cela stimule sa mémoire et crée de beaux moments de complicité. 📸',
      timestamp: '2026-02-04T14:30:00',
      likes: 24,
      isLiked: false,
      sentiment: 'positive',
      isModerated: false,
      isTranslated: false,
      hasVoice: false
    },
    {
      id: 'M002',
      author: 'Jean Martin',
      authorRole: 'Médecin',
      content: 'Excellente initiative Sophie ! Les activités de réminiscence sont très bénéfiques. N\'hésitez pas à commenter les photos ensemble, cela renforce encore plus l\'effet thérapeutique.',
      timestamp: '2026-02-04T14:45:00',
      likes: 18,
      isLiked: true,
      sentiment: 'positive',
      isModerated: false,
      isTranslated: false,
      hasVoice: false
    },
    {
      id: 'M003',
      author: 'Marie Dubois',
      authorRole: 'Aidant',
      content: 'Je traverse une période difficile. Mon père refuse de prendre ses médicaments et devient agressif. Je me sens épuisée...',
      timestamp: '2026-02-04T10:15:00',
      likes: 12,
      isLiked: false,
      sentiment: 'negative',
      isModerated: true,
      moderationNote: 'Message vérifié et approuvé - contenu sensible mais approprié',
      isTranslated: false,
      hasVoice: false
    },
    {
      id: 'M004',
      author: 'Claire Petit',
      authorRole: 'Psychologue',
      content: 'Marie, votre ressenti est totalement légitime. N\'hésitez pas à en parler avec l\'équipe médicale qui suit votre père. Il existe des solutions pour gérer ces situations. Vous pouvez aussi contacter notre ligne d\'écoute.',
      timestamp: '2026-02-04T10:30:00',
      likes: 15,
      isLiked: false,
      sentiment: 'positive',
      isModerated: false,
      isTranslated: false,
      hasVoice: false
    },
    {
      id: 'M005',
      author: 'Pierre Durand',
      authorRole: 'Aidant',
      content: 'I wanted to share a great article about new Alzheimer treatments. Anyone interested?',
      timestamp: '2026-02-03T16:20:00',
      likes: 8,
      isLiked: false,
      sentiment: 'neutral',
      isModerated: false,
      isTranslated: true,
      originalLanguage: 'English',
      hasVoice: false
    },
    {
      id: 'M006',
      author: 'Anne Bernard',
      authorRole: 'Aidant',
      content: 'Quelles sont vos astuces pour gérer les troubles du sommeil ? Ma maman se réveille plusieurs fois par nuit.',
      timestamp: '2026-02-03T09:45:00',
      likes: 21,
      isLiked: true,
      sentiment: 'neutral',
      isModerated: false,
      isTranslated: false,
      hasVoice: true
    }
  ]);

  const handleLike = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, isLiked: !msg.isLiked, likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1 }
        : msg
    ));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: `M${Date.now()}`,
        author: 'Vous',
        authorRole: 'Aidant',
        content: newMessage,
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        sentiment: 'neutral',
        isModerated: false,
        isTranslated: false,
        hasVoice: false
      };
      setMessages([newMsg, ...messages]);
      setNewMessage('');
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return b.likes - a.likes;
    }
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile size={16} className="sentiment-positive" />;
      case 'negative':
        return <Frown size={16} className="sentiment-negative" />;
      default:
        return <Meh size={16} className="sentiment-neutral" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };

  return (
    <div className="community-feed-container">
      {/* Header */}
      <div className="page-header">
        <Link to="/communaute" className="btn btn-secondary btn-icon">
          <ArrowLeft size={20} />
        </Link>
        <div className="header-info">
          <h1 className="page-title">{community.name}</h1>
          <p className="page-subtitle">
            {community.memberCount} membres • {community.description}
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="feed-stats">
        <div className="stat-item">
          <MessageCircle size={18} />
          <span>{messages.length} messages</span>
        </div>
        <div className="stat-item">
          <Heart size={18} />
          <span>{messages.reduce((sum, m) => sum + m.likes, 0)} likes</span>
        </div>
      </div>

      {/* Message Composer */}
      <div className="message-composer">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Partagez votre message avec la communauté..."
          className="message-input"
          rows={3}
        />
        <div className="composer-actions">
          <div className="composer-tools">
            <button className="tool-btn" title="Message vocal">
              <Volume2 size={18} />
            </button>
            <button className="tool-btn" title="Traduire">
              <Globe size={18} />
            </button>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
            <span>Publier</span>
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="feed-controls">
        <div className="sort-tabs">
          <button
            className={`sort-tab ${sortBy === 'recent' ? 'sort-tab-active' : ''}`}
            onClick={() => setSortBy('recent')}
          >
            Plus récents
          </button>
          <button
            className={`sort-tab ${sortBy === 'popular' ? 'sort-tab-active' : ''}`}
            onClick={() => setSortBy('popular')}
          >
            Plus populaires
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="messages-list">
        {sortedMessages.map((message) => (
          <div key={message.id} className="message-card">
            <div className="message-header">
              <div className="author-info">
                <div className="author-avatar">
                  {message.author.charAt(0)}
                </div>
                <div>
                  <div className="author-name">{message.author}</div>
                  <div className="author-meta">
                    <span className="author-role">{message.authorRole}</span>
                    <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>
              </div>
              <button className="message-menu-btn">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="message-content">
              {message.content}
            </div>

            {/* Message Indicators */}
            <div className="message-indicators">
              {message.isModerated && (
                <div className="indicator moderation-indicator" title={message.moderationNote}>
                  <AlertTriangle size={14} />
                  <span>Modéré par IA</span>
                </div>
              )}
              {message.isTranslated && (
                <div className="indicator translation-indicator">
                  <Globe size={14} />
                  <span>Traduit de {message.originalLanguage}</span>
                </div>
              )}
              {message.hasVoice && (
                <div className="indicator voice-indicator">
                  <Volume2 size={14} />
                  <span>Message vocal converti</span>
                </div>
              )}
              <div className="indicator sentiment-indicator">
                {getSentimentIcon(message.sentiment)}
                <span>
                  Sentiment {message.sentiment === 'positive' ? 'positif' : 
                            message.sentiment === 'negative' ? 'négatif' : 'neutre'}
                </span>
              </div>
            </div>

            {/* Message Actions */}
            <div className="message-actions">
              <button
                className={`action-btn ${message.isLiked ? 'action-liked' : ''}`}
                onClick={() => handleLike(message.id)}
              >
                <Heart size={18} fill={message.isLiked ? 'currentColor' : 'none'} />
                <span>{message.likes}</span>
              </button>
              <button className="action-btn">
                <MessageCircle size={18} />
                <span>Répondre</span>
              </button>
              <button className="action-btn action-flag">
                <Flag size={18} />
                <span>Signaler</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
