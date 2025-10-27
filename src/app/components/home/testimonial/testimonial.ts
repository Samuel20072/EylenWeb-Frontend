import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  templateUrl: './testimonial.html',
  styleUrls: ['./testimonial.css']
})
export class Testimonial implements AfterViewInit {
  @Input() name!: string;
  @Input() text!: string;
  @Input() image!: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const element = this.el.nativeElement;

    // Ocultamos inicialmente
    gsap.set(element, { opacity: 0, y: 50 });

    // Observador para activar animación cuando el elemento entra en pantalla
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          });
          observer.unobserve(element); // se anima solo una vez
        }
      });
    });

    observer.observe(element);
  }
}
