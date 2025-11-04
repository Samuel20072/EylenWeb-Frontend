import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list-component.html',
})
export class UsersListComponent implements AfterViewInit {
  @ViewChild('list') list!: ElementRef;
  users = [
    { name: 'Angelica', package: 'Despertar', nextClass: '10/09/2025', remaining: 6, progress: 6/12 },
    { name: 'María', package: 'Renacer', nextClass: '15/09/2025', remaining: 3, progress: 3/12 },
    { name: 'Catalina', package: 'Diosa', nextClass: '18/09/2025', remaining: 0, progress: 12/12 },
    { name: 'Catalina', package: 'Diosa', nextClass: '18/09/2025', remaining: 0, progress: 12/12 },
    { name: 'Catalina', package: 'Diosa', nextClass: '18/09/2025', remaining: 0, progress: 12/12 },
  ];

  ngAfterViewInit() {
    gsap.from(this.list.nativeElement, { opacity: 0, y: 16, duration: 0.5 });
    // hover animation for rows
    this.users.forEach((_, i) => {
      const row = this.list.nativeElement.querySelectorAll('.user-row')[i];
      if (row) {
        row.addEventListener('mouseenter', () => gsap.to(row, { scale: 1.02, duration: 0.2 }));
        row.addEventListener('mouseleave', () => gsap.to(row, { scale: 1, duration: 0.2 }));
      }
    });
  }
}
