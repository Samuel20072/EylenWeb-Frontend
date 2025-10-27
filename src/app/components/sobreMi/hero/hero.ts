import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ButtonComponent } from '../../button/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './hero.html',
})
export class Hero implements AfterViewInit {
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    // Imagen: aparece desde la izquierda
    gsap.from(section.querySelector('.eylen-img'), {
      x: -80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });

    // Texto: aparece desde la derecha
    gsap.from(section.querySelector('.eylen-text'), {
      x: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });

    // Botón: efecto de escala con retardo
    gsap.from(section.querySelector('.eylen-button'), {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });
  }
}
