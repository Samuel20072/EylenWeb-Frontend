import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card-component.html',
})
export class StatsCardComponent implements AfterViewInit {
  @ViewChild('card') card!: ElementRef;
  @Input() title = 'Estadísticas';
  @Input() stats: any = { total: 200, newThisMonth: 18, retention: '85%', satisfaction: '4.5/5' };

  ngAfterViewInit() {
    gsap.from(this.card.nativeElement, { opacity: 0, x: -10, duration: 0.5 });
  }
}
