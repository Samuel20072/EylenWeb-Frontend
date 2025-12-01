import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Testimonial } from '../testimonial/testimonial';
import { ButtonComponent } from '../../button/button';
import { Router } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AuthService } from '../../../services/auth'

import { SitieMediaService } from '../../../services/sitie-media'; // Importamos el servicio de media
import { CommonModule } from '@angular/common';
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [Testimonial, ButtonComponent, CommonModule],
  templateUrl: './hero.html',
})
export class Hero implements OnInit, AfterViewInit {

  isLoggedIn: boolean = false;
  heroImageUrl: string | null = null; // URL de la imagen cargada dinámicamente
  private readonly heroSectionName = 'Hero1';

  constructor(
    private el: ElementRef,
    private router: Router,
    private auth: AuthService,
    private mediaService: SitieMediaService // Inyectamos el servicio de media
  ) {}

  ngOnInit() {
    // Lógica de autenticación
    this.isLoggedIn = this.auth.isAuthenticated();
    this.auth.authChanged$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    });
    
    // Lógica para cargar la imagen del hero
    this.mediaService.getMediaBySection(this.heroSectionName).subscribe({
      next: (mediaArray) => {
        const heroMedia = mediaArray.find(m =>
          m.section?.toLowerCase() === this.heroSectionName.toLowerCase()
        );
    
        if (heroMedia) {
          this.heroImageUrl = heroMedia.url;
          console.log(`Hero image loaded successfully: ${this.heroImageUrl}`);
        } else {
          console.warn(`No media found for section: ${this.heroSectionName}. Using placeholder.`);
        }
      },
      error: (err) => {
        console.error('Error fetching hero media from service:', err);
      }
    });
    
  }

  onLoginClick() {
    if (this.isLoggedIn) {
      console.log('Usuario logeado. Navegando a /profile (Mis clases)');
      this.router.navigate(['/profile']);
    } else {
      console.log('Usuario NO logeado. Navegando a /login');
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    const fadeElems = this.el.nativeElement.querySelectorAll('[gsap-fade]');
    const fadeDelayElems = this.el.nativeElement.querySelectorAll('[gsap-fade-delay]');
    const zoomElems = this.el.nativeElement.querySelectorAll('[gsap-zoom]');
    const slideUpElems = this.el.nativeElement.querySelectorAll('[gsap-slide-up]');
    const staggerElems = this.el.nativeElement.querySelectorAll('[gsap-stagger]');
    const parallaxElems = this.el.nativeElement.querySelectorAll('[gsap-parallax]');

    fadeElems.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: elem, start: 'top 85%' },
      });
    });

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

    zoomElems.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        scale: 0.9,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: elem, start: 'top 90%' },
      });
    });

    slideUpElems.forEach((elem: HTMLElement) => {
      gsap.from(elem, {
        opacity: 0,
        y: 60,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: elem, start: 'top 90%' },
      });
    });

    if (staggerElems.length > 0) {
      gsap.from(staggerElems, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: staggerElems[0],
          start: 'top 85%',
        },
      });
    }

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