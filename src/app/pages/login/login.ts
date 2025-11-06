import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { CustomInputComponent } from '../../components/contacto/custom-input.component/custom-input.component'; // 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, CustomInputComponent,RouterModule],
  templateUrl: './login.html',
})
export class Login implements AfterViewInit {
  @ViewChild('formSection', { static: true }) formSection!: ElementRef;
  @ViewChild('imageSection', { static: true }) imageSection!: ElementRef;

  ngAfterViewInit() {
    // Animación de entrada con GSAP
    const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });

    tl.from(this.formSection.nativeElement, {
      x: -80,
      opacity: 0,
    })
      .from(
        this.imageSection.nativeElement,
        {
          x: 80,
          opacity: 0,
        },
        '-=0.6'
      )
      .from(
        'button',
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );
  }
}
