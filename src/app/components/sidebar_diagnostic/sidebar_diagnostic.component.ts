import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar-diagnostic',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar_diagnostic.component.html',
  styleUrl: './sidebar_diagnostic.component.css'
})
export class SidebarDiagnosticComponent implements OnInit {

  userRole: string | null = null;
  userName = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role?.toUpperCase() ?? null;
    this.userName = user ? `${user.prenom} ${user.nom}` : '';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
