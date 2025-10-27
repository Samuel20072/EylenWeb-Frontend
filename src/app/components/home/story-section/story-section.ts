import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-story-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-section.html',
})
export class StorySection implements AfterViewInit {
  storyContent = {
    title: 'Mi Historia',
    text: `
Desde los 14 años, he construido una carrera sólida en el mundo del modelaje, combinando elegancia, presencia y versatilidad. Con más de 8 años de experiencia, he trabajado en pasarelas, fashion shows, campañas para marcas, presencia en eventos y videoclips musicales. Mi trayectoria inició con certámenes de belleza, donde fui reina por 5 años, lo que permitió desarrollar seguridad escénica y proyección. Mi pasión por la moda y la expresión a través de la imagen me ha llevado a destacar en diferentes áreas del modelaje, aportando siempre profesionalismo y autenticidad en cada proyecto.
`,
    imageSrc: '../../assets/images/MiHistoria.png',
  };

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const elements = this.el.nativeElement.querySelectorAll('[gsap-fade]');
    const slideLeft = this.el.nativeElement.querySelectorAll('[gsap-slide-left]');
    const slideRight = this.el.nativeElement.querySelectorAll('[gsap-slide-right]');

    // Fade general
    elements.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        duration: 1,
        y: 50,
        scrollTrigger: { trigger: elem, start: 'top 85%' },
      });
    });

    // Texto desde la izquierda
    slideLeft.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        x: -80,
        duration: 1,
        scrollTrigger: { trigger: elem, start: 'top 80%' },
      });
    });

    // Imagen desde la derecha
    slideRight.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        x: 80,
        duration: 1,
        scrollTrigger: { trigger: elem, start: 'top 80%' },
      });
    });
  }
}
