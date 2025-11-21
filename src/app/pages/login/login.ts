import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { RouterLink } from '@angular/router';
import { CustomInputComponent } from '../../components/contacto/custom-input.component/custom-input.component'; //

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, CustomInputComponent, RouterModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login implements AfterViewInit {
  loginForm: FormGroup;
  errorMessage = '';
  showPassword = false;

  notification: { message: string; type: 'success' | 'error' } | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.validDomainValidator(['gmail.com', 'hotmail.com', 'outlook.com']),
        ],
      ],
      password: ['', [Validators.required, this.passwordValidator()]],
    });
  }
  private validDomainValidator(allowedDomains: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const atIndex = value.indexOf('@');
      if (atIndex === -1) return null;

      const domain = value.substring(atIndex + 1).toLowerCase();
      if (!domain) return null;
      if (!allowedDomains.includes(domain)) {
        return { invalidDomain: true };
      }

      return null;
    };
  }
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasMinLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[\W_]/.test(value);

      if (!hasMinLength) return { weakPassword: 'minLength' };
      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial)
        return { weakPassword: 'complexity' };

      return null;
    };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notification = {
        message: 'Por favor completa todos los campos correctamente.',
        type: 'error',
      };
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email as string, password as string).subscribe({
      next: (response: any) => {
        this.authService.setUser(response.user, response.access_token);
        this.errorMessage = '';

        this.notification = {
          message: 'Inicio de sesión exitoso.',
          type: 'success',
        };

        setTimeout(() => {
          this.router.navigate(['/Profile']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.notification = {
          message: 'Usuario o contraseña incorrectos',
          type: 'error',
        };
      },
    });
  }

  closeNotification() {
    this.notification = null;
  }
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  
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
