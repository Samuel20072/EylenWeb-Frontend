import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaquetesCards } from '../paquetes-cards/paquetes-cards';
import { FormModal } from '../form-modal/form-modal'; // ✅ Importar el modal

@Component({
  selector: 'app-paquetes-section',
  standalone: true,
  imports: [CommonModule, PaquetesCards, FormModal],
  templateUrl: './paquetes-section.html',
})
export class PaquetesSection {

  packs = [
    {
      title: 'Pack Renacer (4 sesiones).',
      price: '80.000 COP',
      items: [
        'Inicias tu proceso de autodescubrimiento.',
        'Conexión profunda contigo misma en cada sesión.',
        'Primeras herramientas prácticas para tu día a día.',
      ],
      diamonds: 1,
      buttonColor: '#fff',
      buttonTextColor: '#B5121B',
      backgroundColor: 'light',
    },
    {
      title: 'Pack Despertar (8 sesiones).',
      price: '120.000 COP',
      items: [
        'Proceso más completo y sostenido.',
        'Integras hábitos y prácticas que elevan tu energía.',
        'Profundizas en tus emociones y cómo gestionarlas.',
      ],
      diamonds: 2,
      backgroundColor: 'medium',
      buttonColor: '#d6cf78',
      buttonTextColor: '#310D09',
    },
    {
      title: 'Pack Diosa (12 sesiones + ritual).',
      price: '200.000 COP',
      items: [
        'Acompañamiento profundo y personalizado durante todo tu proceso.',
        'Sanación y reconexión con tu esencia femenina.',
        'Ritual especial que marca un antes y un después en tu vida.',
      ],
      diamonds: 3,
      buttonColor: '#fff',
      buttonTextColor: '#B5121B',
      backgroundColor: 'light',
    },
  ];

  // ✅ Abre el modal con el título del paquete
  isModalOpen = false;
  selectedPackage: any = null;
  
  openModal(pkg: any) {
    this.selectedPackage = pkg;
    this.isModalOpen = true;
  }
  
  closeModal() {
    this.isModalOpen = false;
    this.selectedPackage = null;
  }
  
}
