import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const adminGrudsGuard: CanActivateFn = (route, state) => {
  const _authServices = inject(AuthService);
  const _router = inject(Router);
  if (_authServices.getToken() && _authServices.getRole() === 'admin') {
    return true;
  } else {
    return _router.createUrlTree(['/auth/login'], {
      queryParams: { returnurl: state.url },
    });
  }
};
