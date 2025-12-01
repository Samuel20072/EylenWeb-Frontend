import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import gsap from 'gsap';

import { CustomInputComponent } from '../../components/contacto/custom-input.component/custom-input.component';
import { AuthService } from '../../services/auth';
import { ChangeDetectorRef } from '@angular/core';

interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  role: number | 'admin' | 'user';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CustomInputComponent,
  ],
  templateUrl: './login.html',
})
export class Login implements AfterViewInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  @ViewChild('formSection') formSection!: ElementRef;
  @ViewChild('imageSection') imageSection!: ElementRef;

    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private cdr: ChangeDetectorRef
    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    if (this.formSection && this.imageSection) {
      gsap.from(this.formSection.nativeElement, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.from(this.imageSection.nativeElement, {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res: { user: User; access_token: string }) => {
        console.log('Login exitoso:', res);

        let finalRole: 'admin' | 'user';
        let redirectPath: string;

        // Normalizar el rol
        if (res.user.role === 1 || res.user.role === 'admin') {
          finalRole = 'admin';
          redirectPath = '/admin';
        } else {
          finalRole = 'user';
          redirectPath = '/profile';
        }

        const userToSet = {
          ...res.user,
          role: finalRole,
        };

        // Guardar en AuthService
        this.authService.setUser(userToSet, res.access_token);

        // Redirigir
        this.router.navigate([redirectPath]);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = "❌ Credenciales incorrectas. Verifica tu correo o contraseña.";
        } else {
          this.errorMessage = "⚠ Ocurrió un error inesperado. Intenta nuevamente.";
        }
        this.cdr.detectChanges(); // 🔥 Forzar actualización inmediata
      }      
    });
  }
}
