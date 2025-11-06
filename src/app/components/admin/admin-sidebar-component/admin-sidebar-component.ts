import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar-component.html',
})
export class AdminSidebarComponent {
  activeRoute = '';

  items = [
    { icon: 'fa-solid fa-chart-line', label: 'Resumen', route: '/admin/dashboard' },
    { icon: 'fa-solid fa-box', label: 'Paquetes', route: '/admin/paquetes' },
    { icon: 'fa-solid fa-users', label: 'Usuarios', route: '/admin/usuarios' },
    { icon: 'fa-solid fa-calendar-days', label: 'Clases', route: '/admin/calendario' },
    { icon: 'fa-solid fa-gear', label: 'Ajustes', route: '/admin/ajustes' },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }
}
