import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
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
} from 'lucide-angular';

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

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent {
  filter = signal<'all' | 'publication' | 'therapeutic'>('all');
  userRole = signal<'doctor' | 'user'>('doctor');

  activities = signal<Activity[]>([
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

  readonly icons = {
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
  };

  filteredActivities = computed(() => {
    const f = this.filter();
    return this.activities().filter(activity =>
      f === 'all' || activity.type === f
    );
  });

  stats = computed(() => {
    const acts = this.activities();
    return {
      therapeutic: acts.filter(a => a.type === 'therapeutic').length,
      publication: acts.filter(a => a.type === 'publication').length,
      participants: acts
        .filter(a => a.participants)
        .reduce((sum, a) => sum + (a.participants || 0), 0)
    };
  });

  setFilter(f: 'all' | 'publication' | 'therapeutic') {
    this.filter.set(f);
  }

  handleLike(id: string) {
    this.activities.update(activities =>
      activities.map(activity =>
        activity.id === id
          ? {
            ...activity,
            isLiked: !activity.isLiked,
            likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1
          }
          : activity
      )
    );
  }

  getCategoryIcon(category: string) {
    switch (category) {
      case 'cognitive': return Brain;
      case 'creative': return Palette;
      case 'physical': return Smile;
      case 'education': return Brain;
      default: return MessageCircle;
    }
  }

  getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
      'cognitive': 'Cognitif',
      'creative': 'Créatif',
      'physical': 'Physique',
      'education': 'Éducation',
      'testimonial': 'Témoignage',
      'health': 'Santé'
    };
    return labels[category] || category;
  }

  getStatusBadge(status?: string) {
    if (!status) return null;
    const badges: Record<string, { label: string; class: string }> = {
      'scheduled': { label: 'À venir', class: 'status-scheduled' },
      'active': { label: 'En cours', class: 'status-active' },
      'completed': { label: 'Terminée', class: 'status-completed' }
    };
    return badges[status] || null;
  }

  formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  }
}
