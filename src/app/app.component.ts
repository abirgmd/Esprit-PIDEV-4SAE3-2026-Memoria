import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarDiagnosticComponent } from './components/sidebar_diagnostic/sidebar_diagnostic.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarDiagnosticComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MemorIA_Frontend';
  showSidebar = false;

  private readonly noSidebarRoutes = ['/', '/home', '/login', '/signup', '/subscribe', '/publications-feed'];

  constructor(private readonly router: Router, private readonly authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: (event) => {
        try {
          const url = (event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url;
          const baseUrl = url.split('?')[0]; // Ignore query params
          const user = this.authService.getCurrentUser();
          this.showSidebar = user !== null && !this.noSidebarRoutes.includes(baseUrl);
        } catch (e) {
          console.error('Error in AppComponent navigation subscriber:', e);
          this.showSidebar = false;
        }
      },
      error: (err) => console.error('Router events error:', err)
    });
  }
}
