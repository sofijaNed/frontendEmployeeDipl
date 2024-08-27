import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../services/models/role';

export const AdminGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.currentUser.value !== null) {
    return authenticationService.currentUser?.value?.role === Role.Admin ? true : router.parseUrl('');
  }
  return false;
};
