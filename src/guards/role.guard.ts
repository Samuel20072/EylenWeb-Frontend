import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/services/auth';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.user();

    if (user && user.role === 'admin') {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
