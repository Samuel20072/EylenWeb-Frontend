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
    { icon: 'fa-solid fa-chart-line', label: 'Resumen' },
    { icon: 'fa-solid fa-box', label: 'Paquetes' },
    { icon: 'fa-solid fa-users', label: 'Usuarios' },
    { icon: 'fa-solid fa-calendar-days', label: 'Clases' },
    { icon: 'fa-solid fa-gear', label: 'Ajustes' },
  ];
}
