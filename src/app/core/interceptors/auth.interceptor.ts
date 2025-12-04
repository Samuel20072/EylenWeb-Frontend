import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private injector: Injector) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Use Injector to avoid circular dependency: AuthService -> HttpClient -> AuthInterceptor -> AuthService
    const authService = this.injector.get(AuthService);
    const authToken = localStorage.getItem('token');

    // Clone the request and attach the token if it exists
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          authService.logout(); // Clean up state

          // Check current URL to decide where to redirect
          // User requirement: if on admin page and token expires, go to home (inicio)
          if (this.router.url.includes('/admin')) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}