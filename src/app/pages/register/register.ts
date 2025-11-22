import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { CustomInputComponent } from '../../components/contacto/custom-input.component/custom-input.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CustomInputComponent
  ],
  templateUrl: './register.html',
})
export class Register implements AfterViewInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      birthdate: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    gsap.from('#form-section', {
      opacity: 0,
      x: -100,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.from('#image-section', {
      opacity: 0,
      x: 100,
      duration: 1.2,
      delay: 0.3,
      ease: 'power2.out',
    });

    gsap.from('.form-element', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      delay: 0.6,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const form = this.registerForm.value;

    // Mapeo correcto para coincidir con lo que tu backend espera
    const payload = {
      full_name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      city: form.location,
      birth_date: form.birthdate,
      role: 2, // rol por defecto
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        alert('Registro exitoso');
      },
      error: (err) => {
        console.error('Error al registrar:', err);
      },
    });
  }
}
