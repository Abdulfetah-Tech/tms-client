import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Automatically force the browser to attach cookies to cross-origin requests
  return next(req.clone({ withCredentials: true }));
};
