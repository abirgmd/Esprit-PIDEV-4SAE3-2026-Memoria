import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { AuthService } from '../auth/auth.service';
import { map, catchError, of } from 'rxjs';

export const subscriptionGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const subscriptionService = inject(SubscriptionService);
    const authService = inject(AuthService);

    const user = authService.getCurrentUser();
    if (!user) {
        router.navigate(['/login']);
        return of(false);
    }

    // SOIGNANT users have unrestricted access
    if (user.role === 'SOIGNANT') {
        return of(true);
    }

    // ACCOMPAGNANT users need active subscription
    return subscriptionService.getStatus(user.id).pipe(
        map((status: any) => {
            if (status.active) {
                return true;
            } else {
                router.navigate(['/subscribe']);
                return false;
            }
        }),
        catchError(() => {
            router.navigate(['/subscribe']);
            return of(false);
        })
    );
};
