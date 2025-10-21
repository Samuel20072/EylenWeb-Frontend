import { Component } from '@angular/core';
import { Testimonial } from '../testimonial/testimonial';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-hero',
  imports: [Testimonial, ButtonComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  onLoginClick() {
    // Aquí puedes agregar la lógica para el login
    console.log('Login clicked');
  }
}
