import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Class } from './pages/class/class';
import { SobreMi } from './pages/sobre-mi/sobre-mi';
import { Contacto } from './pages/contacto/contacto';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';

// 👇 Importa los componentes del panel admin
import { AdminDashboardComponent } from './components/admin/admin-dashboard-component/admin-dashboard-component';
import { UsersListComponent } from './components/admin/users-list-component/users-list-component';
import { StatsCardComponent } from './components/admin/stats-card-component/stats-card-component';
import { TopPackagesComponent } from './components/admin/top-packages-component/top-packages-component';
import { UpcomingCalendarComponent } from './components/admin/upcoming-calendar-component/upcoming-calendar-component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'clases', component: Class },
  { path: 'sobre-mi', component: SobreMi },
  { path: 'contacto', component: Contacto },
  { path: 'registro', component: Register },
  { path: 'login', component: Login },

  // 👇 Rutas del panel de administración
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // ruta predeterminada
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'usuarios', component: UsersListComponent },
      { path: 'estadisticas', component: StatsCardComponent },
      { path: 'paquetes', component: TopPackagesComponent },
      { path: 'calendario', component: UpcomingCalendarComponent },
    ],
  },
];
