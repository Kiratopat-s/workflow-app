import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const loggedInUser = authService.loggedInUser;

  if (loggedInUser) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${loggedInUser.tokens.access_token}` }
    });
  }
  return next(req);
};
