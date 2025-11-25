import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.dev'; // Asegúrate de que esta ruta sea correcta

interface JwtPayload {
  exp: number;
}
interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string; 
  role?: 'admin' | 'user';
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = environment.apiUrl;

  user = signal<User | null>(null);
  // Emite true cuando el estado de autenticación (isLoggedIn) cambia
  authChanged$ = new BehaviorSubject<boolean>(false); 
  // **NUEVO:** Indica si el servicio terminó de chequear el token en localStorage
  isLoading$ = new BehaviorSubject<boolean>(true); 

  constructor(private http: HttpClient) {
    // 💡 LÓGICA CLAVE: Iniciar la verificación del token al crear el servicio.
    this.checkToken(); 
  }

  // Getter para el avatar (lo mantengo por si es necesario en otros archivos)
  get userAvatarUrl(): string {
    const currentUser = this.user(); 
    return currentUser?.avatarUrl || 'https://i.pravatar.cc/150?img=default'; 
  }
  
  private checkToken() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // Estado inicial: No logueado. Si encontramos datos, intentamos restaurar.
    let isAuthenticated = false; 

    if (token && storedUser) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          // Token expirado: Forzamos el logout y limpiamos todo.
          this.performLogoutCleanup();
        } else {
          // Token válido: Restauramos el usuario en la signal
            const user: User = JSON.parse(storedUser);
          this.user.set(user); 
            isAuthenticated = true;
        }
      } catch (error) {
        console.error('Error decoding token or parsing user:', error);
        this.performLogoutCleanup();
      }
    } else {
        // No hay token o usuario almacenado. Limpiamos por si acaso.
        this.performLogoutCleanup();
    }
    
    // 💡 Notificamos el estado final de la sesión y terminamos la carga
    this.authChanged$.next(isAuthenticated);
    this.isLoading$.next(false);
  }

  private performLogoutCleanup() {
    this.user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, { email, password });
  }

  logout(): Observable<any> {
    this.performLogoutCleanup();
    this.authChanged$.next(false);
    this.user.set(null); // Asegura que la signal esté nula
    return of({ success: true });
  }

  isAuthenticated(): boolean {
    // Ya no es necesario llamar a checkToken aquí, el constructor lo hizo al inicio.
    return !!this.user();
  }

  // El parámetro 'user' ahora espera el tipo User estandarizado (con rol string)
  setUser(user: User, token: string) {
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