import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Asegúrate de que esta ruta es correcta en tu proyecto real
import { AdminPackageService, CreatePackagesDto } from '../../../services/packages'; 
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-create-package',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-package-component.html', // Referencia al archivo HTML
  styles: [
    `
      /* Estilos generales del componente */
      :host {
        display: block;
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, // Recomendación de buenas prácticas (usaremos ChangeDetectorRef)
})
export class CreatePackageComponent {

  // Modelo de datos que coincide con el DTO de la API
  package: CreatePackagesDto = {
    name: '',
    description: '',
    price: 0,
    durationWeeks: 0,
    sessionsCount: 0,
    imageUrl: '',
    isActive: true, // Por defecto activo
  };

  isLoading: boolean = false;
  message: string | null = null;
  isError: boolean = false;
  
  // Inyección de servicios y del detector de cambios
  constructor(
    private adminPackageService: AdminPackageService,
    private cdr: ChangeDetectorRef // <<-- ¡Añadimos ChangeDetectorRef!
  ) {}

  // Validación básica del formulario
  private validateForm(): boolean {
    if (
      !this.package.name ||
      !this.package.price ||
      this.package.price <= 0 ||
      !this.package.durationWeeks ||
      this.package.durationWeeks <= 0 ||
      !this.package.sessionsCount ||
      this.package.sessionsCount <= 0
    ) {
      this.isError = true;
      this.message =
        'Por favor, completa todos los campos requeridos (Nombre, Precio, Duración y Sesiones) con valores válidos.';
      this.cdr.detectChanges(); // Forzamos detección para mostrar el error de validación
      return false;
    }
    this.message = null;
    this.isError = false;
    return true;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.message = 'Enviando datos...';
    this.isError = false;
    this.cdr.detectChanges(); // Forzamos detección para iniciar la animación de carga

    // Construir el DTO
    const dto: CreatePackagesDto = {
      name: this.package.name,
      price: this.package.price,
      durationWeeks: this.package.durationWeeks,
      sessionsCount: this.package.sessionsCount,
      isActive: this.package.isActive,
    };
    if (this.package.description) {
      dto.description = this.package.description;
    }
    if (this.package.imageUrl) {
      dto.imageUrl = this.package.imageUrl;
    }

    // Llamada al servicio para crear el paquete
    this.adminPackageService
      .createPackage(dto)
      .pipe(
        // Manejo de errores
        catchError((err) => {
          console.error('Error al crear el paquete:', err);
          this.isError = true;
          this.message =
            '⚠️ Error al crear el paquete. Verifica tu conexión y permisos. (Detalle: ' + (err.error?.message || err.message) + ')';
          return of(null);
        }),
        // Se ejecuta al finalizar (éxito o error)
        finalize(() => { 
          this.isLoading = false; 
          this.cdr.detectChanges(); // <<-- ¡FORZAMOS la detección al finalizar!
        })
      )
      .subscribe((response) => {
        // Ejecución al recibir respuesta exitosa (código 2xx)
        this.isError = false;
        
        if (response && response.id) {
          // El backend devolvió el paquete con ID
          this.message = `✅ Paquete "${response.name}" creado con éxito (ID: ${response.id}).`;
        } else {
          // Asumimos éxito si la llamada no fue atrapada por catchError, aunque sin detalles del backend
          this.message = `✅ Paquete "${this.package.name}" creado con éxito.`;
        }
        this.resetForm();
        this.cdr.detectChanges(); // Forzamos detección para mostrar el mensaje de éxito
      });
  }

  private resetForm() {
    this.package = {
      name: '',
      description: '',
      price: 0,
      durationWeeks: 0,
      sessionsCount: 0,
      imageUrl: '',
      isActive: true,
    };
  }
}