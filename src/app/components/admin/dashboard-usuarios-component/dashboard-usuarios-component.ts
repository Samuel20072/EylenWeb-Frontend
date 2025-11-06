import { Component } from '@angular/core';
import { UsersListComponent } from '../users-list-component/users-list-component';
import { StatsCardComponent } from '../stats-card-component/stats-card-component';
import { CreateUserComponent } from '../create-user-component/create-user-component';

@Component({
  selector: 'app-dashboard-usuarios-component',
  imports: [UsersListComponent,StatsCardComponent,CreateUserComponent],
  templateUrl: './dashboard-usuarios-component.html',
})
export class DashboardUsuariosComponent {

}
