import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-top-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-packages-component.html',
})
export class TopPackagesComponent implements AfterViewInit {
  @ViewChild('block') block!: ElementRef;
  packs = [
    { title: 'Pack Despertar', users: 45, total: 2000000 },
    { title: 'Pack Renacer', users: 30, total: 1200000 },
    { title: 'Pack Diosa', users: 12, total: 2400000 },
  ];

  ngAfterViewInit() {
    gsap.from(this.block.nativeElement, { opacity: 0, y: 18, duration: 0.5, ease: 'power2.out' });
  }
}
