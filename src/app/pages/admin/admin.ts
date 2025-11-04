import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/admin/admin-header-component/admin-header-component';
import { AdminSidebarComponent } from '../../components/admin/admin-sidebar-component/admin-sidebar-component';
import { SalesDonutComponent } from '../../components/admin/sales-donut-component/sales-donut-component';
import { UpcomingCalendarComponent } from '../../components/admin/upcoming-calendar-component/upcoming-calendar-component';
import { TopPackagesComponent } from '../../components/admin/top-packages-component/top-packages-component';
import { StatsCardComponent } from '../../components/admin/stats-card-component/stats-card-component';
import { UsersListComponent } from '../../components/admin/users-list-component/users-list-component';

@Component({
  selector: 'app-admin',
  imports: [AdminHeaderComponent, AdminSidebarComponent, SalesDonutComponent, UpcomingCalendarComponent, TopPackagesComponent, StatsCardComponent, UsersListComponent],
  templateUrl: './admin.html',
})
export class Admin {

}
