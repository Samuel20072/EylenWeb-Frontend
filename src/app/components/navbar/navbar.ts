import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importamos Router
import { NavbarItemComponent } from './navbar-item';
import { ButtonComponent } from '../button/button';
import { AuthService } from '../../services/auth'; // Aseguramos la ruta correcta del servicio
import { Subscription } from 'rxjs';

// Interfaz local para garantizar la seguridad de tipos, asumiendo que es la misma que en AuthService
interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string; 
  role?: 'admin' | 'user'; 
}

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [NavbarItemComponent, ButtonComponent, CommonModule, RouterLink], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
// La clase debe ser exportada como NavbarComponent para seguir la convención.
export class Navbar implements OnInit, OnDestroy { 
  
  // Propiedades expuestas al template
  user: User | null;
  isLoggedIn: boolean = false;
  userAvatarUrl: string = '';
  userName: string = ''; 
  private authSubscription: Subscription = new Subscription();

  // Inyección de servicios usando inject
  private authService = inject(AuthService);
  private router = inject(Router); // Inyectamos Router

  constructor() {
    // CAMBIO CLAVE: Inicializamos todas las propiedades inmediatamente desde el estado actual del servicio (signal).
    const currentUser = this.authService.user();
    
    this.user = currentUser;
    this.isLoggedIn = !!currentUser;
    
    if (currentUser) {
        // Usamos el getter del servicio
        this.userAvatarUrl = this.authService.userAvatarUrl;
        // Obtenemos el nombre para mostrarlo
        this.userName = currentUser.name; 
    }
    // NOTA: La suscripción en ngOnInit aún es necesaria para manejar cambios reactivos (login/logout).
  } 

  ngOnInit(): void {
    // Nos suscribimos a los cambios de autenticación
    this.authSubscription = this.authService.authChanged$.subscribe(
      (isLoggedInStatus: boolean) => {
        this.isLoggedIn = isLoggedInStatus;
        
        const currentUser = this.authService.user();
        this.user = currentUser;

        if (isLoggedInStatus && currentUser) {
            // Esto se asegura de que la UI reaccione a los cambios (login/logout)
            this.userAvatarUrl = this.authService.userAvatarUrl;
            this.userName = currentUser.name; 
        } else {
            this.userAvatarUrl = '';
            this.userName = '';
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
  
  /**
   * Navega a /admin o /profile dependiendo del rol del usuario.
   */
  onAvatarClick(): void {
    const userRole = this.user?.role;
    
    if (userRole === 'admin') {
      this.router.navigate(['/admin']);
    } else if (userRole === 'user') {
      this.router.navigate(['/profile']);
    } else {
      // Navegación por defecto para usuarios logeados sin un rol explícito
      this.router.navigate(['/profile']); 
    }
  }
}