import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-problem-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-item.html',
})
export class ProblemItem implements AfterViewInit {
  @Input() problemNumber: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageSrc: string = '';
  @Input() isLeft: boolean = true;
  @Input() rotation: number = 0;
  @Input() offsetX: number = 0;
  @Input() offsetY: number = 40;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement.querySelector('.problem-item');
    const image = this.el.nativeElement.querySelector('.problem-image');

    // ✨ Animación de entrada con dirección según isLeft
    gsap.from(element, {
      opacity: 0,
      x: this.isLeft ? -150 : 150,
      rotation: this.isLeft ? -2 : 2,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    // ✨ Efecto hover sobre la imagen
    gsap.set(image, { transformOrigin: 'center' });

    image.addEventListener('mouseenter', () => {
      gsap.to(image, {
        scale: 1.05,
        rotate: this.isLeft ? -3 : 3,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    image.addEventListener('mouseleave', () => {
      gsap.to(image, {
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    });
  }
}
