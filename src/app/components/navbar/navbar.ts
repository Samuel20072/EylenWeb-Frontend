import { Component } from '@angular/core';
import { NavbarItemComponent } from './navbar-item';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-navbar',
  imports: [NavbarItemComponent, ButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  onLoginClick() {
    // Aquí puedes agregar la lógica para el login
    console.log('Login clicked');
  }
}
