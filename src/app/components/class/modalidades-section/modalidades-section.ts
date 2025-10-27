import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ModalidadesCard } from '../modalidades-card/modalidades-card';

@Component({
  selector: 'app-modalidades-section',
  standalone: true,
  imports: [ModalidadesCard],
  templateUrl: './modalidades-section.html',
  styleUrl: './modalidades-section.css'
})
export class ModalidadesSection implements AfterViewInit {
  @ViewChildren(ModalidadesCard, { read: ElementRef })
  cards!: QueryList<ElementRef>;

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Animar el título
      gsap.from(this.el.nativeElement.querySelector('.section-title'), {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.el.nativeElement,
          start: 'top 85%',
        },
      });

    
    });
  }
}
