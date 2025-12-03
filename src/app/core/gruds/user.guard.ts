import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  if (_authService.getToken() && _authService.getRole() === 'user') {
    return true;
  } else {
    return _router.createUrlTree(['/auth/login'], {
      queryParams: { returnurl: state.url },
    });
  }
};
