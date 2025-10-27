import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-experiencias-cards',
  standalone: true,
  templateUrl: './experiencias-cards.html',
  styleUrl: './experiencias-cards.css'
})
export class ExperienciasCards implements AfterViewInit {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() icon: string = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const card = this.el.nativeElement.querySelector('.exp-card');
    const icon = this.el.nativeElement.querySelector('.exp-icon');
    const title = this.el.nativeElement.querySelector('.exp-title');
    const text = this.el.nativeElement.querySelector('.exp-text');

    // Animación inicial
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out'
    });

    // Aparición secuencial del contenido
    gsap.from([icon, title, text], {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.2,
      delay: 0.3,
      ease: 'power2.out'
    });

    // Hover animado con GSAP
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.08,
        rotateY: 4,
        boxShadow: '0 20px 35px rgba(193, 15, 26, 0.4)',
        duration: 0.5,
        ease: 'power3.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        rotateY: 0,
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
        duration: 0.5,
        ease: 'power3.inOut'
      });
    });
  }
}
