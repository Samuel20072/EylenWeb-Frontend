import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importar CommonModule
import gsap from 'gsap';

@Component({
  selector: 'app-images-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './images-card.html',
  styleUrl: './images-card.css'
})
export class ImagesCard implements AfterViewInit {
  @Input() imageUrl!: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const card = this.el.nativeElement.querySelector('.card');
    gsap.fromTo(
      card,
      { scale: 0.9 },
      {
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      }
    );
  }
}
