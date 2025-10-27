import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-item',
  standalone: true,
  imports: [],
  templateUrl: './navbar-item.html',
  styleUrls: ['./navbar-item.css']
})
export class NavbarItemComponent {
  @Input() name: string = '';
  @Input() link: string = '#';
}
