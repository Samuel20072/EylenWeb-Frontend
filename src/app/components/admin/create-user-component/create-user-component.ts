import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user-component.html',
})
export class CreateUserComponent implements AfterViewInit {
  @ViewChild('formContainer') formContainer!: ElementRef;

  user = {
    name: '',
    package: '',
    nextClass: '',
    payment: { amount: null, date: '', validated: false },
  };

  ngAfterViewInit() {
    // Animación inicial del formulario
    gsap.from(this.formContainer.nativeElement, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  onSubmit() {
    if (!this.user.name || !this.user.package || !this.user.payment.amount) {
      gsap.fromTo(
        this.formContainer.nativeElement,
        { x: 0 },
        { x: 10, yoyo: true, repeat: 5, duration: 0.05, ease: 'power1.inOut' }
      );
      return;
    }

    console.log('✅ Usuario creado:', this.user);

    // Animación de éxito
    gsap.to(this.formContainer.nativeElement, {
      scale: 1.02,
      backgroundColor: '#dcfce7',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: 'power1.out',
      onComplete: () => {
        // Reinicia el formulario después de la animación
        this.user = {
          name: '',
          package: '',
          nextClass: '',
          payment: { amount: null, date: '', validated: false },
        };
      },
    });
  }
}
