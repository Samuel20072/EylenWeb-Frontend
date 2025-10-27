import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;

  isPlaying = false;
  isMuted = true; // inicia silenciado

  ngAfterViewInit() {
    // animación de aparición inicial del contenedor del video
    gsap.from(this.videoPlayer.nativeElement, {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power2.out'
    });
  }

  togglePlay() {
    const video = this.videoPlayer.nativeElement;

    if (video.paused) {
      video.play();
      this.isPlaying = true;
      // animación de desvanecimiento del overlay
      gsap.to(this.overlay.nativeElement, { opacity: 0, duration: 0.6, ease: 'power2.inOut' });
    } else {
      video.pause();
      this.isPlaying = false;
      // animación para mostrar overlay de nuevo
      gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
    }
  }

  toggleMute() {
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
    this.isPlaying = false;
    gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
  }
}
