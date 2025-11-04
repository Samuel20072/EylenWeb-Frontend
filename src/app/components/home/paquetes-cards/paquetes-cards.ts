import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-paquetes-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paquetes-cards.html',
  styleUrl: './paquetes-cards.css'
})
export class PaquetesCards implements AfterViewInit {
  @Input() title!: string;
  @Input() price!: string;
  @Input() items!: string[];
  @Input() diamonds!: number;
  @Input() buttonColor: string = '#fff';
  @Input() buttonTextColor: string = '#B5121B';
  @Input() backgroundColor: 'light' | 'medium' | 'dark' | string = 'light';

  // 👇 Nuevo: emite evento cuando el usuario selecciona un pack
  @Output() selectPack = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const card = this.el.nativeElement.querySelector('.card');

    gsap.from(card, {
      opacity: 0,
      y: 100,
      scale: 0.9,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.set(card, { transformOrigin: 'center' });

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        rotate: 1,
        boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        rotate: 0,
        boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    });
  }

  // 👇 Método que se ejecutará al dar clic en el botón
  onSelectPack(): void {
    this.selectPack.emit();
  }
}
