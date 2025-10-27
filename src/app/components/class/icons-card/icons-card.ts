import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-icons-card',
  standalone: true,
  imports: [CommonModule], // 👈 Para usar *ngIf
  templateUrl: './icons-card.html',
})
export class IconsCard implements AfterViewInit {
  @Input() icon?: string; // 👈 Ahora opcional
  @Input() image?: string; // 👈 Nuevo: permite usar imagen
  @Input() title!: string;
  @Input() description!: string;

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    // 👇 Animación suave al aparecer
    gsap.from(this.el.nativeElement, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 90%',
      },
    });
  }
}
