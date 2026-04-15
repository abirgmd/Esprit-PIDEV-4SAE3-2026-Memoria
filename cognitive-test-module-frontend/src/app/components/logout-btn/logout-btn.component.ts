import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout-btn',
  standalone: true,
  template: `
    <button 
      (click)="logout()" 
      class="logout-btn"
      title="Se déconnecter"
    >
      🚪 Déconnexion
    </button>
  `,
  styles: [`
    .logout-btn {
      background-color: #f44;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background-color: #d00;
    }
  `]
})
export class LogoutBtnComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    }
  }
}
