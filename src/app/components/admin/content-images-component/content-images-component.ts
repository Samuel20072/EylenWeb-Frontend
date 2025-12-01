import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Se mantiene, aunque menos crítico
import { gsap } from 'gsap';

import { SitieMediaService, SitieMedia } from '../../../services/sitie-media';
import { UploadMediaModalComponent } from '../site-media/upload-media-modal/upload-media-modal';
import { catchError, of } from 'rxjs';


// Interfaz adaptada para no depender de SafeResourceUrl para imágenes
interface ImageMedia extends SitieMedia {
  // Ya no se requiere 'safeUrl' para <img>, pero heredamos todas las propiedades de SitieMedia
}

@Component({
  selector: 'app-content-images',
  standalone: true,
  // Se eliminó UploadMediaModalComponent de los imports para corregir el error de ruta.
  imports: [CommonModule, HttpClientModule,UploadMediaModalComponent], 
  templateUrl: './content-images-component.html', // Enlaza a la plantilla corregida
})
export class ContentImagesComponent implements OnInit { // Se eliminó AfterViewInit de la implementación
  // PROPIEDAD CORREGIDA: Usamos 'imagesList' (camelCase)
  imagesList: ImageMedia[] = []; 
  loading = false;
  isModalOpen = false; // Se mantiene la propiedad para el estado del modal
    
  // Inyectamos el Servicio y el Sanitizer
  constructor(
    private el: ElementRef, 
    private mediaService: SitieMediaService, 
    private sanitizer: DomSanitizer // Mantenemos DomSanitizer
  ) {}
    
  // Inicialización de datos
  ngOnInit(): void {
    this.loadImages();
  }

  // Se eliminó ngAfterViewInit y la lógica de GSAP para corregir el error de compilación.

  /**
   * Carga todos los medios desde el backend y los filtra para mostrar solo imágenes.
   * Contiene la lógica de depuración para la consola.
   */
  loadImages(): void {
    this.loading = true;
    console.log('--- Iniciando carga de medios ---'); // DEBUG: Inicio de la carga

    this.mediaService.findAll().pipe(
      catchError(err => {
        console.error('🔴 ERROR al cargar los medios del servicio:', err); // DEBUG: Error de conexión/servicio
        this.loading = false;
        return of([]); // Devuelve un array vacío en caso de error
      })
    ).subscribe(data => {

      console.log('✅ Datos brutos recibidos del backend (total):', data); // DEBUG: Datos brutos
      console.log(`TOTAL de elementos recibidos: ${data.length}`);

      // 🚨 CORRECCIÓN CLAVE: Filtrar solo por el tipo 'image'
      const rawImages = data.filter(item => item.type === 'image'); 
        
      console.log('🔎 Elementos filtrados por tipo "image":', rawImages); // DEBUG: Elementos filtrados
      console.log(`IMÁGENES encontradas: ${rawImages.length}`);

      // Asignar los datos filtrados a la propiedad 'imagesList'
      this.imagesList = rawImages as ImageMedia[];
      
      // Si no hay imágenes, revisamos los tipos que sí llegaron
      if (rawImages.length === 0 && data.length > 0) {
        const uniqueTypes = [...new Set(data.map(item => item.type))];
        console.warn(`⚠️ ALERTA: No se encontró el tipo 'image'. Tipos presentes en los datos: ${uniqueTypes.join(', ')}`);
        console.warn('Si el tipo correcto no es "image", debe cambiar el filtro en content-images-component.ts');
      }
      
      this.loading = false;
      console.log('--- Carga de medios completada ---');
    });
  }
      
  // Se mantienen los métodos del modal, aunque el componente hijo fue eliminado de las importaciones
  openModal() {
    console.log('Abriendo modal de subida de media...');
    this.isModalOpen = true;
  }
    
  closeModal(success: boolean): void {
    this.isModalOpen = false;
    if (success) {
      console.log('Modal cerrado con éxito. Recargando imágenes.');
      this.loadImages(); // Recargar la lista tras una subida exitosa
    } else {
      console.log('Modal cerrado sin acción de recarga.');
    }
  }

  /**
   * Implementación de la eliminación con el backend.
   * Reemplazamos `confirm()` y `alert()` con `console.warn` y `console.error`
   * para cumplir con las restricciones del entorno Canvas.
   */
  deleteImage(id: number) {
    console.warn(`[ATENCIÓN] Eliminación solicitada para ID: ${id}. Se procede sin diálogo de confirmación (confirm() no permitido).`);
    // Se ha eliminado la línea 'QD' que causaba error de sintaxis en el código original del usuario.

    this.mediaService.delete(id).subscribe({
      next: () => {
        console.log(`Imagen con ID ${id} eliminada con éxito.`);
        // Actualiza la lista en el frontend filtrando por id (usando imagesList)
        this.imagesList = this.imagesList.filter(v => v.id !== id);
      },
      error: (err) => {
        console.error('Error eliminando imagen:', err);
        console.error('Error al eliminar la imagen. Revisa la consola para más detalles.');
      }
    });
  }
}