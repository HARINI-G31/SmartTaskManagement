import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { dashboardPathForRole } from '../models/auth';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.getCurrentRole();
  const allowedRoles: unknown = route.data['roles'];

  if (role !== null && Array.isArray(allowedRoles) && allowedRoles.includes(role)) {
    return true;
  }

  if (role !== null) {
    return router.parseUrl(dashboardPathForRole(role));
  }

  return router.parseUrl('/login');
};
