import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-upcoming-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-calendar-component.html',
})
export class UpcomingCalendarComponent implements AfterViewInit {
  @ViewChild('card') card!: ElementRef;
  month = 'Septiembre 2025';
  days = Array.from({ length: 30 }, (_, i) => i + 1);
  selected = 8;
  ngAfterViewInit() {
    gsap.from(this.card.nativeElement, { opacity: 0, x: 10, duration: 0.5, ease: 'power2.out' });
  }
}
