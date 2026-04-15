import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Brain,
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
      path: '/tests-cognitifs',
      label: 'Tests cognitifs',
      icon: Brain      
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
