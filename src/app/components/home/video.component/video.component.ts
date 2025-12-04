import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { SitieMediaService } from '../../../services/sitie-media';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  // Nota: Se ha eliminado styleUrl porque no se utiliza un archivo CSS externo.
  template: `
    <section class="bg-[#FFB1B8] flex flex-col items-center py-12 px-4">
      <h2 class="text-xl md:text-2xl font-playfair text-[#1A1A1A] mb-4 text-center">
        ¿Qué es el baile consciente?
      </h2>

      <!-- Contenedor principal del Video -->
      <div
        *ngIf="videoReady; else loading"
        class="relative w-full max-w-[1000px] aspect-video bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
        
        <!-- Reproductor de YouTube (IFRAME) -->
        <iframe
          *ngIf="isYouTubeUrl && sanitizedVideoUrl"
          [src]="sanitizedVideoUrl"
          title="YouTube Video Player"
          frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          class="w-full h-full object-cover">
        </iframe>

        <!-- Reproductor de Video Nativo (Si la URL no es de YouTube) -->
        <video
          *ngIf="!isYouTubeUrl"
          #videoPlayer
          class="w-full h-full object-cover"
          [muted]="isMuted"
          autoplay
          loop
          playsinline
          (click)="togglePlay()"
          (ended)="onVideoEnded()">
          <!-- Nota: videoUrl contendrá la URL de Cloudinary o el fallback, según corresponda -->
          <source [src]="videoUrl" type="video/mp4"> 
          Tu navegador no soporta el elemento video.
        </video>

        <!-- Overlay y Controles (SOLO visibles para Video Nativo) -->
        <ng-container *ngIf="!isYouTubeUrl">
          <!-- Overlay de Play/Pause -->
          <div #overlay
            class="absolute inset-0 flex justify-center items-center bg-black/20 transition-opacity duration-500"
            *ngIf="!isPlaying">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex justify-center items-center shadow-md cursor-pointer hover:bg-gray-50 transition"
              (click)="togglePlay()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-10 md:w-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <!-- Controles de volumen y pantalla completa -->
          <div class="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <button
              (click)="toggleMute()"
              class="volume-btn bg-[#C1121F] text-white p-2 rounded-lg shadow-md hover:bg-[#a32f2f] transition">
              <svg *ngIf="!isMuted" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-.77-3.29-2-4.3v8.6c1.23-1.01 2-2.53 2-4.3z" />
              </svg>
              <svg *ngIf="isMuted" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-.77-3.29-2-4.3v2.3l2 2V12zm2-2.5l2 2V7h-6l2 2.5zM2 4.27L4.28 2 21 18.72 18.73 21l-3-3H7v-4.27l-4-4z"/>
              </svg>
            </button>

            <button
              (click)="toggleFullscreen()"
              class="fullscreen-btn bg-[#C1121F] text-white p-2 rounded-lg shadow-md hover:bg-[#a32f2f] transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm12 5h-3v2h5v-5h-2v3zM7 7h3V5H5v5h2V7zm10 0h3v3h2V5h-5v2z" />
              </svg>
            </button>
          </div>
        </ng-container>
      </div>
      
      <!-- Template de Carga (Loading) - Sólo se mostrará muy brevemente al inicio si el respaldo es rápido. -->
      <ng-template #loading>
        <div class="w-full max-w-[1000px] aspect-video bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
          <p class="text-xl text-gray-500">Cargando video...</p>
        </div>
      </ng-template>
    </section>
  `
})
export class VideoComponent implements OnInit {

  // URL de YouTube que se demostró que funciona como respaldo
  private readonly FALLBACK_YOUTUBE_URL = 'https://youtu.be/-D1IEXVvrSw';

  // Propiedades de estado
  videoUrl: string | null = null;
  sanitizedVideoUrl: SafeResourceUrl | null = null;
  isYouTubeUrl: boolean = false;
  videoReady: boolean = false; // Se establecerá en true en ngOnInit

  // Variables para referencias del DOM (Solo necesarias para video nativo)
  private _videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;

  @ViewChild('videoPlayer')
  set videoPlayer(el: ElementRef<HTMLVideoElement>) {
    if (el) {
      this._videoPlayer = el;
      this.animateVideoPlayer(el.nativeElement);
    }
  }

  get videoPlayer(): ElementRef<HTMLVideoElement> {
    return this._videoPlayer;
  }

  isPlaying = false;
  isMuted = true;

  constructor(
    private sitieMediaService: SitieMediaService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // 1. Cargamos el URL de respaldo inmediatamente para evitar el estado "Cargando"
    // Es mejor mostrar el video de respaldo que nada.
    this.processUrl(this.FALLBACK_YOUTUBE_URL);

    // 2. Intentamos cargar el URL real del servicio en segundo plano
    this.loadRealVideoFromService();
  }

  /**
   * Intenta obtener la URL del video del servicio y la aplica si es válida.
   */
  loadRealVideoFromService() {
    this.sitieMediaService.getMediaBySection('homevideo').pipe(take(1)).subscribe({
      next: (mediaItems: any[]) => {
        const video = mediaItems.find(item => item.type === 'video' && item.is_active);

        if (video && video.url) {
          // Si encontramos una URL válida, sobrescribimos la de respaldo.
          this.processUrl(video.url);
        }
        // Si no hay URL en el servicio, mantenemos la de respaldo (que ya se cargó en ngOnInit).
      },
      error: (error: any) => {
        // El servicio falló, no hacemos nada ya que el respaldo ya está visible.
        console.error('Error al obtener el media de la API. Se mantiene la URL de respaldo de YouTube.', error);
      }
    });
  }

  /**
   * Procesa la URL final, configura el reproductor y marca como listo.
   */
  private processUrl(url: string) {
    this.videoUrl = url;

    if (this.isYouTubeLink(this.videoUrl)) {
      this.isYouTubeUrl = true;
      this.sanitizedVideoUrl = this.convertToEmbedUrl(this.videoUrl);
    } else {
      this.isYouTubeUrl = false;

      // Lógica de corrección de Cloudinary si aplica
      if (this.videoUrl!.includes('res.cloudinary.com') && this.videoUrl!.includes('/raw/upload/')) {
        this.videoUrl = this.videoUrl!.replace('/raw/upload/', '/video/upload/');
        if (!this.videoUrl.includes('.')) {
          this.videoUrl += '.mp4';
        }
      }
    }
    // ESTO es crucial: Asegura que el contenedor del video se muestre
    this.videoReady = true;
  }

  /**
   * Determina si la URL es un enlace conocido de YouTube.
   */
  private isYouTubeLink(url: string): boolean {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be');
  }

  /**
   * Convierte una URL de YouTube (larga o corta) a una URL de inserción segura (embed).
   */
  private convertToEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';

    // Extraer ID de 'watch?v=' (Formato largo)
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    }
    // Extraer ID de 'youtu.be/' (Formato corto)
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    // URL de inserción (embed) segura.
    const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // --- Animación y Controles (Solo para Video Nativo) ---

  animateVideoPlayer(videoElement: HTMLVideoElement) {
    gsap.from(videoElement, {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power2.out'
    });
  }

  togglePlay() {
    if (this.isYouTubeUrl) return;

    if (!this.videoPlayer) return;
    const video = this.videoPlayer.nativeElement;

    if (video.paused) {
      video.play();
      this.isPlaying = true;
      if (this.overlay) {
        gsap.to(this.overlay.nativeElement, { opacity: 0, duration: 0.6, ease: 'power2.inOut' });
      }
    } else {
      video.pause();
      this.isPlaying = false;
      if (this.overlay) {
        gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
      }
    }
  }

  toggleMute() {
    if (this.isYouTubeUrl) return;

    if (!this.videoPlayer) return;

    const video = this.videoPlayer.nativeElement;
    this.isMuted = !this.isMuted;
    video.muted = this.isMuted;

    gsap.fromTo(
      '.volume-btn',
      { scale: 1 },
      { scale: 0.9, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.inOut' }
    );
  }

  toggleFullscreen() {
    if (this.isYouTubeUrl) return;

    if (!this.videoPlayer) return;

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
    if (this.isYouTubeUrl) return;

    this.isPlaying = false;
    if (this.overlay) {
      gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
    }
  }
}