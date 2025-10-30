import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-redes-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redes-section.html',
})
export class RedesSection implements AfterViewInit{
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    // ✨ Animación de aparición tipo WOW (al entrar al viewport)
    gsap.from(section.querySelectorAll('.wow-icon'), {
      opacity: 0,
      y: 50,
      scale: 0.8,
      duration: 1.2,
      stagger: 0.3,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });

    // ✨ Animación del botón
    gsap.from(section.querySelector('.wow-btn'), {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });
  }
}
