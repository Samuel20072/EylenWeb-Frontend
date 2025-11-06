import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail-component.html',
})
export class UserDetailComponent implements OnInit, AfterViewInit {
  @Input() user: any;
  constructor(private router: Router, private el: ElementRef) {}

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['/admin/dashboard-usuarios']);
    }
  }

  ngAfterViewInit() {
    gsap.from(this.el.nativeElement, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: 'power2.out',
    });
  }

  goBack() {
    gsap.to(this.el.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 0.4,
      ease: 'power1.in',
      onComplete: () => {
        // ✅ Convertimos la navegación en una llamada normal (no async)
        this.router.navigate(['/admin/usuarios']);
      },
    });
  }
}
