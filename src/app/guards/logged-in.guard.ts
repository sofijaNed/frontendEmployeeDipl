import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationRoutes } from '../constants/navigation-routes';
import { AuthenticationService } from '../services/authentication.service';

export const LoggedInGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.token) {
    return true;
  }
  return router.parseUrl(`${NavigationRoutes.Login}`);
};
