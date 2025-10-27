import { Component, AfterViewInit, ElementRef } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import {ButtonComponent} from '../../button/button'

gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-agendar-ahora-section',
  imports: [ButtonComponent,CommonModule],
  templateUrl: './agendar-ahora-section.html',
})
export class AgendarAhoraSection implements AfterViewInit{
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const section = this.el.nativeElement.querySelector('section');
    const title = section.querySelector('h2');
    const paragraph = section.querySelector('p');
    const button = section.querySelector('app-button');

    gsap.from(title, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });

    gsap.from(paragraph, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });

    gsap.from(button, {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      delay: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });
  }
}
