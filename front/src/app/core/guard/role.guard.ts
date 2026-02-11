import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SecurityService } from '@core/service/security.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const securityService = inject(SecurityService);
    const router = inject(Router);

    const user = securityService.getCurrentUser();
    const role = user?.role;

    if (!role || !allowedRoles.includes(role)) {
      router.navigate(['/private/dashboard']);
      return false;
    }

    return true;
  };
};
