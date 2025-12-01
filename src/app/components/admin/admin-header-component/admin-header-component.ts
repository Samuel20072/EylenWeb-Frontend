import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell-component/notification-bell-component';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, NotificationBellComponent],
  templateUrl: './admin-header-component.html',
})
export class AdminHeaderComponent implements OnInit {
  
  user: any = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Obtener usuario desde el servicio
    this.user = this.authService.user();

    // Si el usuario no existe, lo expulsamos
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
