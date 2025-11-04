import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-sidebar-component.html',
})
export class AdminSidebarComponent {
  items = [
    { icon: '📊', label: 'Resumen' },
    { icon: '🛍️', label: 'Paquetes' },
    { icon: '👥', label: 'Usuarios' },
    { icon: '📅', label: 'Clases' },
    { icon: '⚙️', label: 'Ajustes' },
  ];
}
