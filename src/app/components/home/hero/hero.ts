import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { Testimonial } from '../testimonial/testimonial';
import { ButtonComponent } from '../../button/button';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [Testimonial, ButtonComponent],
  templateUrl: './hero.html',
})
export class Hero implements AfterViewInit {
  constructor(private el: ElementRef) {}

  onLoginClick() {
    console.log('Login clicked');
  }

  ngAfterViewInit() {
    const fadeElems = this.el.nativeElement.querySelectorAll('[gsap-fade]');
    const fadeDelayElems = this.el.nativeElement.querySelectorAll('[gsap-fade-delay]');
    const zoomElems = this.el.nativeElement.querySelectorAll('[gsap-zoom]');
    const slideUpElems = this.el.nativeElement.querySelectorAll('[gsap-slide-up]');
    const staggerElems = this.el.nativeElement.querySelectorAll('[gsap-stagger]');
    const parallaxElems = this.el.nativeElement.querySelectorAll('[gsap-parallax]');

    // Fade-in general
    fadeElems.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: elem, start: 'top 85%' },
      });
    });

    // Fade con retraso
    fadeDelayElems.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        y: 30,
        duration: 1.4,
        delay: 0.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: elem, start: 'top 85%' },
      });
    });

    // Zoom (para el título principal)
    zoomElems.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        scale: 0.9,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: elem, start: 'top 90%' },
      });
    });

    // Slide-up (para el párrafo)
    slideUpElems.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        y: 60,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: elem, start: 'top 90%' },
      });
    });

    // Testimonios (stagger)


    // Imagen con efecto parallax suave
    parallaxElems.forEach((elem: HTMLElement) => {
      const img = elem.querySelector('img');
      gsap.fromTo(
        img,
        { y: 0, rotate: -2 },
        {
          y: -40,
          rotate: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: elem,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }
}
