import { Component,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Importa esto
import { IconsCard } from '../../class/icons-card/icons-card'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
@Component({
  selector: 'app-formacion-section',
  standalone: true,
  imports: [CommonModule, IconsCard],
  templateUrl: './formacion-section.html',
})
export class FormacionSection {
  cards = [
    {
      image: '../../assets/images/sobreMi/Folder.png',
      title: 'Modelo Profesional',
      description: '8 años de experiencia en pasarelas y fotografía.',
      backgroundColor: '#FFFFFF',
      iconBackgroundColor: '#C1121F',
    },
    {
      image: '../../assets/images/sobreMi/Arms Up.png',
      title: 'Clases de Expresión Corporal',
      description: 'Enfocadas en movimiento libre y conexión interior.',
      backgroundColor: '#FFFFFF',
      iconBackgroundColor: '#C1121F',
    },
    {
      image: '../../assets/images/sobreMi/Music.png',
      title: 'Danza Consciente',
      description: 'Baile Consciente” (presencial y online).',
      backgroundColor: '#FFFFFF',
      iconBackgroundColor: '#C1121F',
    },
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
