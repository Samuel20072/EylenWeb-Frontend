import { Component, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list-component.html',
})
export class UsersListComponent implements AfterViewInit {
  @ViewChild('list') list!: ElementRef;
  @ViewChildren('userRow') userRows!: QueryList<ElementRef>;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private router: Router) {}

  users = [
    {
      id: 1,
      name: 'Angélica',
      package: 'Despertar',
      nextClass: '10/09/2025',
      remaining: 6,
      progress: 6 / 12,
      payment: { amount: 50000, date: '01/09/2025', validated: false },
      classes: [
        { id: 1, date: '10/09/2025', hour: '10:00 AM' },
        { id: 2, date: '13/09/2025', hour: '4:00 PM' },
      ],
    },
    {
      id: 2,
      name: 'María',
      package: 'Renacer',
      nextClass: '15/09/2025',
      remaining: 3,
      progress: 3 / 12,
      payment: { amount: 60000, date: '03/09/2025', validated: true },
      classes: [
        { id: 3, date: '15/09/2025', hour: '2:00 PM' },
        { id: 4, date: '17/09/2025', hour: '6:00 PM' },
      ],
    },
    {
      id: 3,
      name: 'Laura',
      package: 'Energía',
      nextClass: '20/09/2025',
      remaining: 8,
      progress: 8 / 12,
      payment: { amount: 70000, date: '05/09/2025', validated: false },
      classes: [
        { id: 5, date: '20/09/2025', hour: '8:00 AM' },
        { id: 6, date: '25/09/2025', hour: '5:00 PM' },
      ],
    },
  ];

  filteredUsers = [...this.users];

  ngAfterViewInit() {
    gsap.from(this.list.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
    });
  }

  filterUsers(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.package.toLowerCase().includes(query)
    );

    const rows = this.userRows.map((r) => r.nativeElement);
    gsap.fromTo(
      rows,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }
    );
  }

  validatePayment(user: any) {
    user.payment.validated = true;
    const index = this.filteredUsers.indexOf(user);
    const target = this.userRows.toArray()[index]?.nativeElement;
    gsap.to(target, {
      backgroundColor: '#dcfce7',
      scale: 1.02,
      duration: 0.5,
      ease: 'power1.out',
      yoyo: true,
      repeat: 1,
    });
  }

  rejectPayment(user: any) {
    user.payment.validated = false;
    const index = this.filteredUsers.indexOf(user);
    const target = this.userRows.toArray()[index]?.nativeElement;
    gsap.to(target, {
      backgroundColor: '#fee2e2',
      scale: 1.02,
      duration: 0.5,
      ease: 'power1.out',
      yoyo: true,
      repeat: 1,
    });
  }

  goToUserDetail(user: any) {
    gsap.to(this.list.nativeElement, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setTimeout(() => this.router.navigate(['/admin/usuarios', user.id]), 100);
      },
    });
  }
}
