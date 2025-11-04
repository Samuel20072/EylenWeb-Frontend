import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../components/admin/admin-header-component/admin-header-component';
import { AdminSidebarComponent } from '../../components/admin/admin-sidebar-component/admin-sidebar-component';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet, // 👈 necesario para usar rutas internas
    AdminHeaderComponent,
    AdminSidebarComponent,
  ],
  templateUrl: './admin.html',
})
export class Admin {}
