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
import { AuthService } from '../../services/auth'; // 🔥 CORREGIDA: Ruta del servicio

// Define la interfaz User que coincide con la estructura esperada por AuthService
interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string; 
  // OJO: Aquí el backend puede enviar un número (1, 2, etc.) o el string ('admin', 'user')
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

  @ViewChild('formSection') formSection!: ElementRef;
  @ViewChild('imageSection') imageSection!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
      next: (res: { user: User; token: string }) => { // Tipado de la respuesta
        console.log('Login exitoso:', res);

        // 🔥 LÓGICA DE CONVERSIÓN DEL ROL Y REDIRECCIÓN

        let finalRole: 'admin' | 'user';
        let redirectPath: string;

        // 1. Determinar el rol (asumiendo que 1 es 'admin' y cualquier otra cosa es 'user')
        if (res.user.role === 1 || res.user.role === 'admin') {
          finalRole = 'admin';
          redirectPath = '/admin';
        } else {
          finalRole = 'user';
          redirectPath = '/profile'; // Redirigir a /profile para usuarios normales
        }

        // 2. Crear una copia del objeto de usuario para pasar al servicio
        const userToSet = {
            ...res.user,
            role: finalRole as 'admin' | 'user' // Sobrescribir el rol con el formato string
        };

        // 3. Guardar el usuario con el rol en formato string
        this.authService.setUser(userToSet, res.token);

        // 4. Redirección final
        this.router.navigate([redirectPath]);
      },
      error: (err) => {
        console.error('Error en login:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      },
    });
  }
}