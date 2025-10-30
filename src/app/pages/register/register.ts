import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../../components/contacto/custom-input.component/custom-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, CustomInputComponent],
  templateUrl: './register.html',
})
export class Register implements AfterViewInit {
  ngAfterViewInit(): void {
    // Animación entrada suave
    gsap.from('#form-section', {
      opacity: 0,
      x: -100,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.from('#image-section', {
      opacity: 0,
      x: 100,
      duration: 1.2,
      delay: 0.3,
      ease: 'power2.out',
    });

    gsap.from('.form-element', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      delay: 0.6,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });
  }
}
