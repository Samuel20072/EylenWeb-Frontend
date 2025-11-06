import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell-component/notification-bell-component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, NotificationBellComponent],
  templateUrl: './admin-header-component.html',
})
export class AdminHeaderComponent {
  user = {
    name: 'Natalia',
    avatar: 'https://i.pravatar.cc/40?img=47',
  };

  constructor(private router: Router) {}

  logout() {
    // Aquí podrías limpiar datos del usuario si los guardas en localStorage
    // localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
