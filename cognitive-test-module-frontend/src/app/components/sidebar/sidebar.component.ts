import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
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
} from 'lucide-angular';

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  children?: { path: string; label: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  mobileOpen = signal(false);
  expandedMenus = signal<string[]>(['/tests-cognitifs']);

  readonly icons = {
    ChevronDown,
    ChevronRight,
    Brain,
    LayoutDashboard
  };

  menuItems: MenuItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/tests-cognitifs',
      label: 'Tests cognitifs',
      icon: Brain      
    },
    {
      path: '/diagnosis',
      label: 'Diagnostic',
      icon: Stethoscope,
      children: [
        { path: '/diagnosis', label: 'Dashboard' },
        { path: '/diagnosis/create', label: 'Nouveau test' }
      ]
    },
    {
      path: '/treatment',
      label: 'Traitement',
      icon: Shield,
      children: [
        { path: '/treatment', label: 'Dashboard' },
        { path: '/treatment/zones/create', label: 'Créer une zone' },
        { path: '/treatment/tracking', label: 'Tracking GPS' }
      ]
    },
    {
      path: '/analyses',
      label: 'Analyses',
      icon: BarChart3
    },
    {
      path: '/alertes',
      label: 'Alertes',
      icon: Bell,
      children: [
        { path: '/alertes', label: 'Dashboard' },
        { path: '/alertes/create', label: 'Créer une alerte' },
        { path: '/alertes/reports', label: 'Rapports' }
      ]
    },
    {
      path: '/planning',
      label: 'Planning',
      icon: Calendar,
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
      icon: Users
    },
    {
      path: '/communaute',
      label: 'Communauté',
      icon: MessageCircle,
      children: [
        { path: '/communaute', label: 'Communautés' },
        { path: '/communaute/analytics', label: 'Analytics' }
      ]
    },
    {
      path: '/activites',
      label: 'Activités',
      icon: Activity
    },
    {
      path: '/parametres',
      label: 'Paramètres',
      icon: Settings
    }
  ];

  toggleMenu(path: string): void {
    const menus = this.expandedMenus();
    if (menus.includes(path)) {
      this.expandedMenus.set(menus.filter((p: string) => p !== path));
    } else {
      this.expandedMenus.set([...menus, path]);
    }
  }

  isExpanded(path: string): boolean {
    return this.expandedMenus().includes(path);
  }

  onNavClick(): void {
    this.mobileOpen.set(false);
  }
}
