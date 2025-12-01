import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaquetesCards } from '../paquetes-cards/paquetes-cards';
import { FormModal } from '../form-modal/form-modal';
import { AdminPackageService, Package } from '../../../services/packages';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // 🛑 Importar Router para la navegación

@Component({
  selector: 'app-paquetes-section',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PaquetesCards, FormModal],
  // Nota: Si usas 'templateUrl', debes asegurarte que el path './paquetes-section.html' es correcto.
  templateUrl: './paquetes-section.html', 
})
export class PaquetesSection implements OnInit {

  packs$!: Observable<Package[]>; 
  
  isModalOpen = false;
  selectedPackage: Package | null = null;
  
  // 🛑 Inyectar Router en el constructor
  constructor(
    private adminPackageService: AdminPackageService,
    private router: Router // Inyección del Router
  ) {}

  ngOnInit(): void {
    this.packs$ = this.adminPackageService.findAllPackages()
        .pipe(
            map(allPacks => allPacks.filter(p => p.isActive)) 
        );
  }

  /**
   * 🛑 NUEVA FUNCIÓN: Verifica si el usuario está logueado revisando localStorage.
   * Reproduce la lógica usada en FormModal.
   */
  private isUserLoggedIn(): boolean {
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        // Retorna true si existe un objeto user con la propiedad id
        return !!user?.id;
      }
      return false;
    } catch (e) {
      console.error('Error al verificar el estado de autenticación:', e);
      return false;
    }
  }
  
  /**
   * 🛑 FUNCIÓN MODIFICADA: Abre el modal si está logueado, sino redirige a /login.
   */
  openModal(pack: Package) { 
    // 🛑 Paso 1: Verificar autenticación
    if (!this.isUserLoggedIn()) {
      // 🛑 Paso 2: Redirigir al login si no está logueado
      // Asume que la ruta de login es '/login'
      this.router.navigate(['/login']);
      return;
    }

    // Si está logueado, procede a abrir el modal
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