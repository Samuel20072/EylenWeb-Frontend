import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-sales-donut',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-donut-component.html',
})
export class SalesDonutComponent implements AfterViewInit {
  @ViewChild('card') card!: ElementRef;
  data = [
    { label: 'Search', value: 30, color: '#9f1239' },
    { label: 'Email', value: 20, color: '#f472b6' },
    { label: 'Direct', value: 25, color: '#fb7185' },
    { label: 'Ads', value: 25, color: '#fca5a5' },
  ];

  total = this.data.reduce((s, d) => s + d.value, 0);

  ngAfterViewInit() {
    gsap.from(this.card.nativeElement, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
  }

  // helper to calc stroke-dasharray
  getDash(offsetIndex: number) {
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    let start = 0;
    for (let i = 0; i < offsetIndex; i++) start += this.data[i].value;
    const dash = (this.data[offsetIndex].value / this.total) * circumference;
    const gap = circumference - dash;
    const dashOffset = (start / this.total) * circumference;
    return { dash, gap, dashOffset, circumference };
  }
}
