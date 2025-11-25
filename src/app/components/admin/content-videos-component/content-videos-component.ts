// src/app/dashboard/content-videos-component/content-videos-component.ts

import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Para el servicio
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Para seguridad de URL
import { gsap } from 'gsap';

// Dependencias de nuestro flujo de subida
import { SitieMediaService, SitieMedia } from '../../../services/sitie-media';
import { UploadMediaModalComponent } from '../site-media/upload-media-modal/upload-media-modal';
import { catchError, of } from 'rxjs'; // Para manejo de errores

// Extender la interfaz para incluir la URL segura
interface VideoMedia extends SitieMedia {
    safeUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-content-videos',
  standalone: true,
  // ⭐ Añadimos las dependencias necesarias: Modal, HTTP, etc.
  imports: [CommonModule, UploadMediaModalComponent, HttpClientModule], 
  templateUrl: './content-videos-component.html',
})
export class ContentVideosComponent implements OnInit, AfterViewInit {
    
  // ⭐ Reemplazamos la lista estática por una propiedad de la interfaz extendida
  videos: VideoMedia[] = []; 
  loading = false;
  isModalOpen = false; // ⭐ Estado del modal
    
  // ⭐ Inyectamos el Servicio y el Sanitizer
  constructor(
    private el: ElementRef, 
    private mediaService: SitieMediaService, 
    private sanitizer: DomSanitizer // Necesario para bindear URLs de iframes
    ) {}
    
  // Inicialización de datos
  ngOnInit(): void {
    this.loadVideos();
  }

  ngAfterViewInit() {
    // La animación de GSAP se ejecutará después de que se carguen los videos
    // Nota: Podrías envolver esto en un setTimeout(..., 0) o usar un observable.
    gsap.from(this.el.nativeElement.querySelectorAll('.video-card'), {
      opacity: 0,
      y: 25,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
    });
  }

  // ⭐ Implementación de la carga de videos desde el backend
  loadVideos(): void {
    this.loading = true;
    this.mediaService.findAll().pipe(
      catchError(err => {
        console.error('Error cargando videos:', err);
        this.loading = false;
        return of([]); // Devuelve un array vacío en caso de error
      })
    ).subscribe(data => {
      // 1. Filtrar solo videos (type: 'video')
      const rawVideos = data.filter(item => item.type === 'video'); 
      
      // 2. Sanitizar cada URL antes de asignarla a la lista
      this.videos = rawVideos.map(vid => ({
          ...vid,
          safeUrl: this.sanitizeUrl(vid.url)
      }));
      
      this.loading = false;
    });
  }
    
  /**
   * Sanitiza la URL para que Angular la considere segura en un iframe.
   * Si las URLs de Cloudinary son videos, no necesitan Sanitizer, pero las de YouTube sí.
   */
  sanitizeUrl(url: string): SafeResourceUrl {
    // Asumimos que si la URL viene de YouTube, es un embed seguro.
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // ⭐ Reemplazamos la función addVideo() por openModal()
  openModal() {
    this.isModalOpen = true;
  }
  
  // ⭐ Función para cerrar el modal y recargar si fue exitoso
  closeModal(success: boolean): void {
    this.isModalOpen = false;
    if (success) {
      this.loadVideos(); // Recargar la lista tras una subida exitosa
    }
  }

  // ⭐ Implementación de la eliminación con el backend
  deleteVideo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este video? Esta acción es permanente y eliminará el archivo de Cloudinary.')) {
      // Llama al servicio de eliminación (ASUMIMOS que el SitieMediaService tiene un método delete)
      this.mediaService.delete(id).subscribe({
          next: () => {
              // Actualiza la lista en el frontend
              this.videos = this.videos.filter(v => v.id !== id);
              // Notificación de éxito
          },
          error: (err) => {
              console.error('Error eliminando video:', err);
              alert('Error al eliminar el video. Consulta la consola.');
          }
      });
    }
  }
}