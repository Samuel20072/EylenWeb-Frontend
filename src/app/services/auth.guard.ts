import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isLoading$.pipe(
      // Espera a que el AuthService termine de evaluar el token
      filter((loading) => !loading),
      map(() => {
        if (!this.auth.isAuthenticated()) {
          // Si intenta acceder a admin y no está autenticado (token vencido o inexistente), ir a inicio
          if (state.url.includes('/admin')) {
            this.router.navigate(['/']);
          } else {
            // Para otras rutas protegidas (ej. profile), ir a login
            this.router.navigate(['/login']);
          }
          return false;
        }
        return true;
      })
    );
  }
}
