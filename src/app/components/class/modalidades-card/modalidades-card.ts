import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-modalidades-card',
  standalone: true,
  imports: [],
  templateUrl: './modalidades-card.html',
  styleUrl: './modalidades-card.css'
})
export class ModalidadesCard {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() description!: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    gsap.from(this.el.nativeElement, {
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 85%',
      },
    });
  }
}
