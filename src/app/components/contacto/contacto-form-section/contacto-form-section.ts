import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactoForm } from '../contacto-form/contacto-form'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-contacto-form-section',
  standalone: true,
  imports: [CommonModule, ContactoForm],
  templateUrl: './contacto-form-section.html',
})
export class ContactoFormSection implements AfterViewInit {
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    // Animación de entrada para ambos lados
    gsap.from(section.querySelector('.form-container'), {
      opacity: 0,
      x: -80,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 85%' },
    });

    gsap.from(section.querySelector('.image-container'), {
      opacity: 0,
      x: 80,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 85%' },
    });
  }
}
