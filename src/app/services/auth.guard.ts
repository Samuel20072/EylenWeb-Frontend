import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.isLoading$.pipe(
      // Espera a que el AuthService termine de evaluar el token
      filter((loading) => !loading),
      map(() => {
        if (!this.auth.isAuthenticated()) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
