import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-testimonial-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-video.html',
  styleUrl: './testimonial-video.css'
})
export class TestimonialVideo implements AfterViewInit {
  @Input() videoSrc: string = '';
  @Input() overlayText: string = '';
  @Input() testimonialText: string = '';
  @Input() personName: string = '';
  @Input() personAge: string = '';
  
  isPlaying = false;

  constructor(private el: ElementRef) {}

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  ngAfterViewInit() {
    const card = this.el.nativeElement.querySelector('[gsap-card]');
    const fade = this.el.nativeElement.querySelector('[gsap-fade]');
    const overlay = this.el.nativeElement.querySelector('[gsap-overlay]');
    const slideUp = this.el.nativeElement.querySelector('[gsap-slide-up]');

    // Animación principal del card
    gsap.from(card, {
      opacity: 0,
      scale: 0.9,
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
    });

    // Fade del video
    gsap.from(fade, {
      opacity: 0,
      scale: 0.95,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: fade, start: 'top 90%' },
    });

    // Overlay inferior
    gsap.from(overlay, {
      opacity: 0,
      y: 40,
      duration: 1.2,
      delay: 0.3,
      ease: 'power2.out',
      scrollTrigger: { trigger: overlay, start: 'top 90%' },
    });

    // Texto inferior (testimonio)
    gsap.from(slideUp, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      delay: 0.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: slideUp, start: 'top 85%' },
    });

    // Hover interactivo 3D
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 6,
        rotateX: -y * 6,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  }
}
