import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienciasCards } from '../experiencias-cards/experiencias-cards';

@Component({
  selector: 'app-experiencias-section',
  standalone: true, // ✅ IMPORTANTE
  imports: [CommonModule, ExperienciasCards], // ✅ Añadimos CommonModule
  templateUrl: './experiencias-section.html',
  styleUrls: ['./experiencias-section.css'] // ✅ Corregido (plural)
})
export class ExperienciasSection {
  cards = [
    {
      title: 'Clases personalizadas y grupales',
      content: '',
      icon: '../../assets/images/icons/Party.png'
    },
    {
      title: 'Clases 1:1',
      content: '',
      icon: '../../assets/images/icons/Swing.png'
    },
    {
      title: 'Clases online via zoom',
      content: '',
      icon: '../../assets/images/icons/Dancing.png'
    }
  ];
}
