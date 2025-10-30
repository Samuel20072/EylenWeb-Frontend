import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimoniosCard } from '../testimonios-card/testimonios-card';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-testimonios-section',
  standalone: true,
  imports: [CommonModule, TestimoniosCard],
  templateUrl: './testimonios-section.html',
})
export class TestimoniosSection implements AfterViewInit {
  testimonios = [
    {
      name: 'Ana Sofía R.',
      text: 'Eylen crea un ambiente mágico. Me sentí segura para explorar mi cuerpo y mis emociones como nunca antes. Cada clase es un regalo para el alma.',
      image: 'assets/images/testimonio1.jpg',
    },
    {
      name: 'Sofía G.',
      text: 'El baile consciente me ayudó a reconectarme con mi cuerpo y mis emociones. Me siento más libre y segura de mí misma.',
      image: 'assets/images/testimonio2.jpg',
    },
    {
      name: 'Camila R.',
      text: 'Más que clases, son espacios de sanación. Eylen tiene una energía hermosa que te invita a sentirte en paz.',
      image: 'assets/images/testimonio3.jpg',
    },
  ];

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    gsap.from(section.querySelectorAll('.testimonial-card'), {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });
  }
}
