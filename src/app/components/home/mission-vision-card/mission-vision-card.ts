import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-mission-vision-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission-vision-card.html'
})
export class MissionVisionCard implements AfterViewInit {
  @Input() title: string = '';
  @Input() content: string = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const card = this.el.nativeElement.querySelector('.mission-card');
    const title = this.el.nativeElement.querySelector('.mission-title');
    const text = this.el.nativeElement.querySelector('.mission-text');

    // Animación de entrada de la tarjeta
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });

    // Aparición del título y texto con leve retraso
    gsap.from([title, text], {
      opacity: 0,
      y: 15,
      duration: 0.8,
      delay: 0.3,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Hover animado con gsap
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.03,
        boxShadow: '0 15px 25px rgba(0,0,0,0.15)',
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
        duration: 0.4,
        ease: 'power2.inOut'
      });
    });
  }
}
