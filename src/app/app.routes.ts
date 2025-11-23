import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Class } from './pages/class/class';
import { SobreMi } from './pages/sobre-mi/sobre-mi';
import { Contacto } from './pages/contacto/contacto';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';

import { AdminDashboardComponent } from './components/admin/admin-dashboard-component/admin-dashboard-component';
import { DashboardUsuariosComponent } from './components/admin/dashboard-usuarios-component/dashboard-usuarios-component';
import { StatsCardComponent } from './components/admin/stats-card-component/stats-card-component';
import { DashboradPaquetesComponent } from './components/admin/dashborad-paquetes-component/dashborad-paquetes-component';
import { UpcomingCalendarComponent } from './components/admin/upcoming-calendar-component/upcoming-calendar-component';
import { DashboardContenidoComponent } from './components/admin/dashboard-contenido-component/dashboard-contenido-component';
import { UserDetailComponent } from './components/admin/user-detail-component/user-detail-component';

// 🛡️ IMPORTA EL ROLE GUARD
import { RoleGuard } from '../guards/role.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'clases', component: Class },
  { path: 'sobre-mi', component: SobreMi },
  { path: 'contacto', component: Contacto },
  { path: 'registro', component: Register },
  { path: 'login', component: Login },

  // 🛡️ PROTECCIÓN PARA ADMIN
  {
    path: 'admin',
    component: Admin,
    canActivate: [RoleGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'usuarios', component: DashboardUsuariosComponent },
      { path: 'usuarios/:id', component: UserDetailComponent },
      { path: 'estadisticas', component: StatsCardComponent },
      { path: 'paquetes', component: DashboradPaquetesComponent },
      { path: 'calendario', component: UpcomingCalendarComponent },
      { path: 'ajustes', component: DashboardContenidoComponent },
    ],
  },
];
