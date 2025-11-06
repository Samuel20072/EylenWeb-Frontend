import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upcoming-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-calendar-component.html',
})
export class UpcomingCalendarComponent implements AfterViewInit {
  @ViewChild('card') card!: ElementRef;

  month = 'Noviembre 2025';
  days = Array.from({ length: 30 }, (_, i) => i + 1);
  selected: number | null = 12;

  ngAfterViewInit() {
    gsap.from(this.card.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  selectDay(day: number) {
    this.selected = day;
  }

  nextMonth() {
    gsap.to(this.card.nativeElement, {
      opacity: 0,
      x: 40,
      duration: 0.4,
      onComplete: () => {
        this.month = 'Diciembre 2025';
        gsap.fromTo(
          this.card.nativeElement,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 }
        );
      },
    });
  }

  prevMonth() {
    gsap.to(this.card.nativeElement, {
      opacity: 0,
      x: -40,
      duration: 0.4,
      onComplete: () => {
        this.month = 'Octubre 2025';
        gsap.fromTo(
          this.card.nativeElement,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 }
        );
      },
    });
  }
}
