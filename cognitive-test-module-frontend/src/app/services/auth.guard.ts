import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}

/**
 * Standalone guard function using dependency injection
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

/**
 * Role-based guard
 */
export const roleGuard: (roles: string[]) => CanActivateFn = 
  (allowedRoles: string[]) => (route, state) => {
    const authService = (route.component as any)._injector.get(AuthService);
    const router = (route.component as any)._injector.get(Router);
    
    const userRole = authService.getUserRole();
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  };
