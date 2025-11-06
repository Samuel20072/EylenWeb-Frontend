import { Component, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-packages-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packages-list-component.html',
})
export class PackagesListComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChildren('packageCard') packageCards!: QueryList<ElementRef>;

  packages = [
    {
      id: 1,
      name: 'Despertar',
      description: 'Conecta con tu energía interior y renueva tu cuerpo.',
      price: 50000,
      classes: 12,
      level: 'Principiante',
      active: true,
      users: 24,
    },
    {
      id: 2,
      name: 'Renacer',
      description: 'Un viaje de movimiento y expresión para el alma.',
      price: 60000,
      classes: 10,
      level: 'Intermedio',
      active: true,
      users: 18,
    },
    {
      id: 3,
      name: 'Energía',
      description: 'Fluye con la música y libera tu poder corporal.',
      price: 70000,
      classes: 8,
      level: 'Avanzado',
      active: false,
      users: 10,
    },
  ];

  filteredPackages = [...this.packages];

  ngAfterViewInit() {
 
  }

  filterPackages(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPackages = this.packages.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    gsap.fromTo(
      this.packageCards.map(c => c.nativeElement),
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
    );
  }

  toggleActive(pkg: any) {
    pkg.active = !pkg.active;
    const target = this.packageCards.toArray()[this.filteredPackages.indexOf(pkg)].nativeElement;

    gsap.to(target, {
      backgroundColor: pkg.active ? '#dcfce7' : '#fee2e2',
      scale: 1.05,
      duration: 0.4,
      ease: 'power1.out',
      yoyo: true,
      repeat: 1,
    });
  }

  deletePackage(pkg: any) {
    const index = this.filteredPackages.indexOf(pkg);
    const target = this.packageCards.toArray()[index].nativeElement;

    gsap.to(target, {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: 'power1.in',
      onComplete: () => {
        this.packages = this.packages.filter(p => p.id !== pkg.id);
        this.filteredPackages = this.filteredPackages.filter(p => p.id !== pkg.id);
      },
    });
  }
}
