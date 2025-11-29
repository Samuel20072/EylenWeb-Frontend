import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface Package {
    id: number;
    name: string;
    description?: string;
    price: number;
    durationWeeks: number;
    sessionsCount: number;
    imageUrl?: string;
    isActive: boolean;
    created_at: string;
    updated_at: string;
  }

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-paquetes-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paquetes-cards.html',
  styleUrl: './paquetes-cards.css'
})
export class PaquetesCards implements AfterViewInit {

  // 🛑 ÚNICO INPUT DE DATOS: el objeto 'pack' del API
  @Input() pack!: Package; 

  // Propiedades de presentación (Inputs)
  @Input() diamonds!: number; 
  @Input() buttonColor: string = '#fff';
  @Input() buttonTextColor: string = '#B5121B';
  @Input() backgroundColor: 'light' | 'medium' | 'dark' | string = 'light';

  // Emite el objeto Package seleccionado
  @Output() selectPack = new EventEmitter<Package>();

  constructor(private el: ElementRef) {}

  // 🛑 GETTER: Proporciona el valor para {{ title }}
  public get title(): string {
    return this.pack?.name || 'Cargando Paquete';
  }

  // 🛑 GETTER: Proporciona el valor para {{ price }} (Formateado)
  public get price(): string {
    // Asumo que quieres formato de moneda, por ejemplo, COP
    return `$${this.pack?.price.toLocaleString('es-CO') || 'N/A'} COP`; 
  }
  
  // 🛑 GETTER: Proporciona el array para *ngFor="let item of items"
  public get items(): string[] {
    const items: string[] = [
      `${this.pack?.sessionsCount || 0} sesiones de entrenamiento personal.`,
      `Vigencia de ${this.pack?.durationWeeks || 0} semanas.`
    ];

    if (this.pack?.description) {
      items.push(this.pack.description);
    }

    return items;
  }
  
  // ngAfterViewInit y lógica de GSAP se mantienen igual...
  ngAfterViewInit(): void {
    const card = this.el.nativeElement.querySelector('.card');

    gsap.from(card, {
      opacity: 0,
      y: 100,
      scale: 0.9,
      duration: 1,
      ease: 'power3.out',
     
    });

    gsap.set(card, { transformOrigin: 'center' });

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        rotate: 1,
        boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        rotate: 0,
        boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    });
  }

  onSelectPack(): void {
    this.selectPack.emit(this.pack);
  }
}