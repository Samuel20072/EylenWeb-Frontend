import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-fisolofia-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fisolofia-section.html',
})
export class FisolofiaSection implements AfterViewInit {
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const section = this.el.nativeElement;

    // Animar título y texto desde la izquierda
    gsap.from(section.querySelector('.filosofia-text'), {
      opacity: 0,
      x: -60,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });

    // Animar imagen desde la derecha
    gsap.from(section.querySelector('.filosofia-image'), {
      opacity: 0,
      x: 60,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      },
    });
  }
}
