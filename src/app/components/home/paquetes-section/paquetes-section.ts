import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaquetesCards} from '../paquetes-cards/paquetes-cards'

@Component({
  selector: 'app-paquetes-section',
  standalone: true,
  imports: [CommonModule,PaquetesCards],
  templateUrl: './paquetes-section.html',
  styleUrl: './paquetes-section.css'
})
export class PaquetesSection {
  packs = [
    {
      title: 'Pack Renacer (4 sesiones).',
      price: '80.000 cop',
      items: [
        'Inicias tu proceso de autodescubrimiento.',
        'Conexión profunda contigo misma en cada sesión.',
        'Primeras herramientas prácticas para tu día a día.'
      ],
      diamonds: 1,      
      buttonColor: '#fff',
      buttonTextColor: '#B5121B',
      backgroundColor: 'light'
    },
    {
      title: 'Pack Despertar (8 sesiones).',
      price: '120.000 cop',
      items: [
        'Proceso más completo y sostenido.',
        'Integras hábitos y prácticas que elevan tu energía.',
        'Profundizas en tus emociones y cómo gestionarlas.'
      ],
      diamonds: 2,
      backgroundColor: 'medium',
      buttonColor: '#d6cf78',
      buttonTextColor: '#310D09'
    },
    {
      title: 'Pack Diosa (12 sesiones + ritual).',
      price: '200.000 cop',
      items: [
        'Acompañamiento profundo y personalizado durante todo tu proceso.',
        'Sanación y reconexión con tu esencia femenina.',
        'Ritual especial que marca un antes y un después en tu vida.'
      ],
      diamonds: 3,
      buttonColor: '#fff',
      buttonTextColor: '#B5121B',
      backgroundColor: 'light'
    }
  ];
}
