import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ImagesCard } from '../images-card/images-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-images-section',
  imports: [CommonModule,ImagesCard],
  templateUrl: './images-section.html',
  styleUrl: './images-section.css'
})
export class ImagesSection {
  @ViewChildren('card', { read: ElementRef }) cards!: QueryList<ElementRef>;

  images = [
    { url: '../../assets/images/classImages/image1.png' },
    { url: '../../assets/images/classImages/image1.png' },
    { url: '../../assets/images/classImages/image1.png' },
    { url: '../../assets/images/classImages/image1.png' },
    { url: '../../assets/images/classImages/image1.png' },
    { url: '../../assets/images/classImages/image1.png' },
  ];

  ngAfterViewInit() {
    this.cards.forEach((card, index) => {
      gsap.from(card.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card.nativeElement,
          start: 'top 85%',
        },
      });
    });
  }
}
