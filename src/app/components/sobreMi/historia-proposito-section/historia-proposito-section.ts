import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-historia-proposito-section',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './historia-proposito-section.html',

})
export class HistoriaPropositoSection implements AfterViewInit {
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    // Título principal y texto aparecen con fade y desplazamiento
    gsap.from(section.querySelectorAll('.historia-title, .historia-text'), {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.3,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });

    gsap.from(section.querySelectorAll('.proposito-title, .proposito-text'), {
      opacity: 0,
      y: 40,
      duration: 1.2,
      delay: 0.5,
      ease: 'power3.out',
      stagger: 0.3,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      },
    });
  }
}
