import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Importa esto
import { IconsCard } from '../icons-card/icons-card';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-experiencias-section',
  standalone: true,
  imports: [CommonModule, IconsCard], // 👈 Agrégalo aquí
  templateUrl: './experiencias-section.html',
})
export class ExperienciasSection implements AfterViewInit {
  cards = [
    { icon: 'fas fa-spa', title: 'Conexión inicial', description: 'Respiración y conciencia corporal.' },
    { icon: 'fas fa-music', title: 'Movimiento libre', description: 'Exploración guiada del ritmo y emociones.' },
    { image: '../assets/images/icons/BodyPositive.png', title: 'Expresión corporal', description: 'Técnicas de baile consciente.' },
    { icon: 'fas fa-heart', title: 'Cierre emocional', description: 'Reflexión o liberación final.' },
  ];

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const cards = this.el.nativeElement.querySelectorAll('.icon-card');

    }, 100); // 👈 Pequeño delay para asegurar render
  }
  
}
