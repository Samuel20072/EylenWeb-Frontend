import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpcomingCalendarComponent } from '../../components/admin/upcoming-calendar-component/upcoming-calendar-component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UpcomingCalendarComponent, CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('profileCard', { static: false }) profileCard!: ElementRef;

  user: any = null;
  isEditing: boolean = false;

  // Campos editables
  editedName: string = '';
  editedEmail: string = '';

  ngOnInit() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      this.user = JSON.parse(userData);
      this.editedName = this.user.full_name;
      this.editedEmail = this.user.email;
    } else {
      console.warn('⚠️ No hay usuario logueado.');
    }
  }

  ngAfterViewInit() {
    if (this.profileCard) {
      gsap.from(this.profileCard.nativeElement, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      });
    }
  }

  enableEdit() {
    this.isEditing = true;
    gsap.fromTo(
      '.edit-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedName = this.user.full_name;
    this.editedEmail = this.user.email;
  }

  saveChanges() {
    this.user.full_name = this.editedName;
    this.user.email = this.editedEmail;

    localStorage.setItem('user', JSON.stringify(this.user));
    this.isEditing = false;

    gsap.to('.profile-info', {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.to('.profile-info', {
          opacity: 1,
          duration: 0.4,
        });
      },
    });
  }
}
