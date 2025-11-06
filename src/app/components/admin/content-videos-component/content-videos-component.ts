import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-content-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-videos-component.html',
})
export class ContentVideosComponent implements AfterViewInit {
  videos = [
    { id: 1, title: 'Video de bienvenida', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 2, title: 'Clases grupales', url: 'https://www.youtube.com/embed/aqz-KE-bpKQ' },
  ];

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    gsap.from(this.el.nativeElement.querySelectorAll('.video-card'), {
      opacity: 0,
      y: 25,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
    });
  }

  addVideo() {
    const url = prompt('Ingresa la URL del video de YouTube:');
    const title = prompt('Título del video:');
    if (url && title) {
      this.videos.push({ id: Date.now(), title, url });
    }
  }

  deleteVideo(id: number) {
    this.videos = this.videos.filter(v => v.id !== id);
  }
}
