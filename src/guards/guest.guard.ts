import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/services/auth';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class GuestGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.auth.isLoading$.pipe(
            filter((loading) => !loading),
            map(() => {
                if (this.auth.isAuthenticated()) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;
            })
        );
    }
}
