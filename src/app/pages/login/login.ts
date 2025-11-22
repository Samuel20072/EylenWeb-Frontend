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
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

import { CustomInputComponent } from '../../components/contacto/custom-input.component/custom-input.component';
import { AuthService } from '../../services/auth';

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
    private authService: AuthService
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
      next: (res) => {
        console.log('Login exitoso:', res);
      },
      error: (err) => {
        console.error('Error en login:', err);
      },
    });
  }
}
