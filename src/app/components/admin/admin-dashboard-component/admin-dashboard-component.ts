import { Component } from '@angular/core';
import { SalesDonutComponent } from '../sales-donut-component/sales-donut-component';
import { UpcomingCalendarComponent } from '../upcoming-calendar-component/upcoming-calendar-component';
import { TopPackagesComponent } from '../top-packages-component/top-packages-component';
import { StatsCardComponent } from '../stats-card-component/stats-card-component';
import { UsersListComponent } from '../users-list-component/users-list-component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    SalesDonutComponent,
    UpcomingCalendarComponent,
    TopPackagesComponent,
    StatsCardComponent,
    UsersListComponent
  ],
  templateUrl: './admin-dashboard-component.html',
})
export class AdminDashboardComponent {}
