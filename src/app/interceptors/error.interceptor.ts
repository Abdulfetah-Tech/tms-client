import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected system transaction error occurred.';

      if (error.status === 401) {
        // Session expired or invalid HttpOnly transport auth cookies detected
        errorMessage = 'Your login session has expired. Please sign in again.';
        authService.currentUser.set(null); // Instantly wipe memory nodes
      } else if (error.error && typeof error.error === 'object') {
        // Parse RFC 7807 ProblemDetails contract shapes standard fields
        errorMessage = error.error.detail || error.error.title || errorMessage;
      }

      // Propagate the parsed, friendly message down into the reactive streams
      return throwError(() => new Error(errorMessage));
    })
  );
};
