import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SecurityService } from '@core/service/security.service';

export const isConnectGuard: CanActivateFn = (route, state) => {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (!securityService.isAuthenticated()) {
    router.navigate(['/public/login']);
    return false;
  }

  return true;
};
