import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.dev';

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = environment.apiUrl;

  user = signal<any | null>(null);
  authChanged$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user.set(JSON.parse(storedUser));
    }
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          this.logout().subscribe();
        } else {
          this.authChanged$.next(true);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout().subscribe();
      }
    } else {
      this.authChanged$.next(false);
    }
  }

  // 🚀 Registro — acepta cualquier objeto
  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, { email, password });
  }

  logout(): Observable<any> {
    this.user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authChanged$.next(false);
    return of({ success: true });
  }

  isAuthenticated(): boolean {
    this.checkToken();
    return !!localStorage.getItem('token');
  }

  setUser(user: any, token: string) {
    this.user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.authChanged$.next(true);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
  }
}
