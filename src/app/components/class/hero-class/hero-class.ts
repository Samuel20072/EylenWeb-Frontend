import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ButtonComponent } from '../../button/button';
@Component({
  selector: 'app-hero-class',
  imports: [ButtonComponent],
  templateUrl: './hero-class.html',
})
export class HeroClass {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    // Animaciones GSAP al cargar
    gsap.from(section.querySelector('.hero-text'), {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from(section.querySelector('.hero-subtext'), {
      opacity: 0,
      y: 40,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out'
    });

    gsap.from(section.querySelector('.hero-button'), {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: 0.8,
      ease: 'back.out(1.7)'
    });
  }

  onReserveClick() {
    console.log('Reserva tu clase');
  }
}
