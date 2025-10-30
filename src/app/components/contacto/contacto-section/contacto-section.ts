import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-contacto-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto-section.html',
})
export class ContactoSection implements AfterViewInit {
  // 🧩 Props reutilizables
  @Input() title: string = 'Conecta conmigo';
  @Input() text: string =
    'Estoy aquí para acompañarte en tu camino de conexión, movimiento y amor propio. Escríbeme si deseas agendar una clase, resolver dudas o simplemente compartir tu historia. 💖';
  @Input() bgColor: string = ''; // color de fondo personalizable

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    // ✨ Animación de aparición con GSAP + ScrollTrigger
    gsap.from(section.querySelectorAll('.fade-in'), {
      opacity: 0,
      y: 40,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });
  }
}
