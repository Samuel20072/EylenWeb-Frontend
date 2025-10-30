import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { ImagesCard } from '../../class/images-card/images-card';

@Component({
  selector: 'app-momentos-section',
  imports: [CommonModule,ImagesCard],
  templateUrl: './momentos-section.html',
})
export class MomentosSection {
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
