import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { SitieMediaService } from '../../../services/sitie-media'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importar DomSanitizer

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit, AfterViewInit { 
  
  // Propiedades
  videoUrl: string | null = null; 
  sanitizedVideoUrl: SafeResourceUrl | null = null; // Para URL segura de YouTube
  isYouTubeUrl: boolean = false; // Flag para determinar el tipo de reproductor

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;

  isPlaying = false;
  isMuted = true; // inicia silenciado

  // INYECTAR EL SERVICIO Y EL SANITIZER
  constructor(
    private sitieMediaService: SitieMediaService,
    private sanitizer: DomSanitizer // Inyectar DomSanitizer
  ) {}

  ngOnInit() {
    this.loadVideoUrl();
  }

  loadVideoUrl() {
    this.sitieMediaService.getMediaBySection('homevideo').subscribe(
      (mediaItems) => {
        const video = mediaItems.find(item => item.type === 'video' && item.is_active); 
        
        if (video) {
          this.videoUrl = video.url;
          console.log('🔍 URL CRUDA (DB) obtenida:', this.videoUrl); // Verifica la URL cruda
          
          // CORRECCIÓN DE FORMATO CLOUDINARY (temporal hasta arreglar el backend)
          if (this.videoUrl.includes('res.cloudinary.com') && this.videoUrl.includes('/raw/upload/')) {
            // 1. Reemplazar /raw/upload/ por /video/upload/
            this.videoUrl = this.videoUrl.replace('/raw/upload/', '/video/upload/');
            
            // 2. Asegurar que tiene extensión si no la tiene (asumimos .mp4)
            if (!this.videoUrl.includes('.')) {
              this.videoUrl += '.mp4';
            }
            console.log('⚠️ URL de Cloudinary corregida para reproducción:', this.videoUrl);
          }


          // LÓGICA DE DETECCIÓN DE YOUTUBE
          this.isYouTubeUrl = this.videoUrl.includes('youtube.com') || this.videoUrl.includes('youtu.be');

          if (this.isYouTubeUrl) {
            // Transformar la URL de YouTube para usar el reproductor embebido (embed)
            const embedUrl = this.convertToEmbedUrl(this.videoUrl);
            
            if (embedUrl.includes('/embed/')) { // Verificar si se pudo extraer el ID correctamente
              this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
              console.log('✅ URL de YouTube (Embed) generada:', embedUrl); 
            } else {
              console.error('❌ ERROR: No se pudo extraer el ID del video de YouTube. Revisa el formato de la URL guardada en la base de datos.');
              this.videoUrl = null; // Detener la carga para no mostrar el iframe vacío
            }

          } else {
            // Es una URL de Cloudinary o directa (se usará en la etiqueta <video>)
            console.log('✅ URL de video nativo a cargar:', this.videoUrl); 
          }
        } else {
          console.warn('No se encontró un video activo para la sección homevideo');
          this.videoUrl = null; 
          this.sanitizedVideoUrl = null;
        }
      },
      (error) => {
        console.error('Error al obtener el media de la API:', error);
        this.videoUrl = null;
        this.sanitizedVideoUrl = null;
      }
    );
  }

  // Helper para convertir URL de YouTube a URL de Embed
  private convertToEmbedUrl(url: string): string {
    let videoId = '';
    // Patrón para URLs estándar: https://www.youtube.com/watch?v=VIDEO_ID
    const matchStandard = url.match(/[?&]v=([^&]+)/);
    if (matchStandard) {
      videoId = matchStandard[1];
    } else {
      // Patrón para URLs cortas: https://youtu.be/VIDEO_ID
      const matchShort = url.match(/youtu\.be\/([^?]+)/);
      if (matchShort) {
        videoId = matchShort[1];
      }
    }

    if (videoId) {
      // Agregar parámetros para deshabilitar controles y poner autoplay/mute
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0`;
    }
    return url; 
  }


  ngAfterViewInit() {
    if (this.videoPlayer && !this.isYouTubeUrl) {
      // animación de aparición inicial del contenedor del video (SOLO PARA VIDEO NATIVO)
      gsap.from(this.videoPlayer.nativeElement, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power2.out'
      });
    }
  }

  togglePlay() {
    // Solo aplica a video nativo
    if (!this.videoPlayer || this.isYouTubeUrl) return; 
    const video = this.videoPlayer.nativeElement;

    if (video.paused) {
      video.play();
      this.isPlaying = true;
      // animación de desvanecimiento del overlay
      if (this.overlay) {
        gsap.to(this.overlay.nativeElement, { opacity: 0, duration: 0.6, ease: 'power2.inOut' });
      }
    } else {
      video.pause();
      this.isPlaying = false;
      // animación para mostrar overlay de nuevo
      if (this.overlay) {
        gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
      }
    }
  }

  toggleMute() {
    // Solo aplica a video nativo
    if (!this.videoPlayer || this.isYouTubeUrl) return; 
    const video = this.videoPlayer.nativeElement;
    this.isMuted = !this.isMuted;
    video.muted = this.isMuted;

    // pequeña animación del botón al presionar
    gsap.fromTo(
      '.volume-btn',
      { scale: 1 },
      { scale: 0.9, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.inOut' }
    );
  }

  toggleFullscreen() {
    // Solo aplica a video nativo
    if (!this.videoPlayer || this.isYouTubeUrl) return; 
    const video = this.videoPlayer.nativeElement;

    gsap.fromTo(
      '.fullscreen-btn',
      { rotate: 0 },
      { rotate: 20, duration: 0.3, yoyo: true, repeat: 1, ease: 'back.out(1.7)' }
    );

    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => console.error('Error pantalla completa:', err));
    } else {
      document.exitFullscreen();
    }
  }

  onVideoEnded() {
    // Solo aplica a video nativo
    if (this.isYouTubeUrl) return; 
    
    this.isPlaying = false;
    if (this.overlay) {
      gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
    }
  }
}