import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarItemComponent } from './navbar-item';
import { ButtonComponent } from '../button/button';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';
import gsap from 'gsap';

interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: 'admin' | 'user';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NavbarItemComponent, ButtonComponent, CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

  user: User | null;
  userName: string = '';
  userAvatarUrl: string = '';
  isLoggedIn = false;

  menuOpen = false;
  mobileMenuOpen = false;

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;

  private authService = inject(AuthService);
  private router = inject(Router);
  private authSubscription: Subscription = new Subscription();

  constructor() {
    const currentUser = this.authService.user();
    this.user = currentUser;
    this.isLoggedIn = !!currentUser;

    if (currentUser) {
      this.userAvatarUrl = this.authService.userAvatarUrl;
      this.userName = currentUser.name;
    }
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChanged$.subscribe(status => {
      this.isLoggedIn = status;

      const currentUser = this.authService.user();
      this.user = currentUser;

      if (status && currentUser) {
        this.userAvatarUrl = this.authService.userAvatarUrl;
        this.userName = currentUser.name;
      }
    });
  }

  ngAfterViewInit() { }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    setTimeout(() => {
      if (this.dropdownMenu) {
        gsap.fromTo(
          this.dropdownMenu.nativeElement,
          { opacity: 0, y: -10, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }
        );
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    setTimeout(() => {
      if (this.mobileMenu && this.mobileMenuOpen) {
        gsap.fromTo(
          this.mobileMenu.nativeElement,
          { x: '100%' },
          { x: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    });
  }

  closeMobileMenu() {
    if (this.mobileMenu) {
      gsap.to(this.mobileMenu.nativeElement, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.mobileMenuOpen = false;
        }
      });
    } else {
      this.mobileMenuOpen = false;
    }
  }

  goToProfile() {
    this.menuOpen = false;
    this.router.navigate(['/profile']);
  }

  goToAdmin() {
    this.menuOpen = false;
    this.router.navigate(['/admin']);
  }

  logout() {
    this.menuOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
}
