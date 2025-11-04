import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header-component.html',
})
export class AdminHeaderComponent {
  user = {
    name: 'Natalia',
    avatar: 'https://i.pravatar.cc/40?img=47',
  };
}
