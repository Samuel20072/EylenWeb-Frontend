import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  user: string;
  time: string;
}

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell-component.html',
})
export class NotificationBellComponent {
  notifications: Notification[] = [
    { user: 'Ana Pérez', time: 'hace 5 minutos' },
    { user: 'Carlos López', time: 'hace 30 minutos' },
  ];

  showPanel = false;

  toggleNotifications() {
    this.showPanel = !this.showPanel;
  }
}
