import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Importa esto
import { IconsCard } from '../icons-card/icons-card';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';


@Component({
  selector: 'app-beneficios-section',
  imports: [CommonModule,IconsCard],
  templateUrl: './beneficios-section.html',
  styleUrl: './beneficios-section.css'
})
export class BeneficiosSection {
  cards = [
    { image: '../../assets/images/icons/Skydive.png', title: 'Conexión inicial', description: 'Respiración y conciencia corporal.' },
    { image: '../../assets/images/icons/Arms Up.png', title: 'Movimiento libre', description: 'Exploración guiada del ritmo y emociones.' },
    { icon: 'fa-solid fa-face-laugh-beam', title: 'Expresión corporal', description: 'Técnicas de baile consciente.' },
    { image: '../../assets/images/icons/Learning.png', title: 'Cierre emocional', description: 'Reflexión o liberación final.' },
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
