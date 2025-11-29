import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaquetesCards } from '../paquetes-cards/paquetes-cards';
import { FormModal } from '../form-modal/form-modal';
import { AdminPackageService, Package } from '../../../services/packages';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; // 🛑 NECESARIO: Importar Observable

@Component({
  selector: 'app-paquetes-section',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PaquetesCards, FormModal], 
  templateUrl: './paquetes-section.html',
})
export class PaquetesSection implements OnInit {

  // 🛑 CAMBIO CLAVE 1: Ahora es un Observable, no un array
  packs$!: Observable<Package[]>; 
  
  isModalOpen = false;
  selectedPackage: Package | null = null;
  
  constructor(private adminPackageService: AdminPackageService) {}

  ngOnInit(): void {
    // 🛑 CAMBIO CLAVE 2: Asignamos el Observable filtrado a 'packs$'
    // El pipe async en el template se encargará de la suscripción y la detección de cambios.
    this.packs$ = this.adminPackageService.findAllPackages()
        .pipe(
            map(allPacks => allPacks.filter(p => p.isActive)) 
        );
  }
  
  // ... (Los métodos openModal, closeModal y auxiliares se mantienen iguales)
  openModal(pack: Package) { 
    this.selectedPackage = pack;
    this.isModalOpen = true;
  }
  
  closeModal() {
    this.isModalOpen = false;
    this.selectedPackage = null;
  }
  
  calculateDiamonds(sessions: number): number {
    if (sessions >= 10) return 3;
    if (sessions >= 6) return 2;
    return 1;
  }

  getBackgroundColor(price: number): 'light' | 'medium' | 'dark' {
    if (price >= 150000) return 'medium'; 
    if (price >= 100000) return 'dark';
    return 'light';
  }
}