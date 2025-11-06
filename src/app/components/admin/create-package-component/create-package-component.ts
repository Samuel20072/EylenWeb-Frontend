import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-create-package',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-package-component.html',
})
export class CreatePackageComponent implements AfterViewInit {
  @ViewChild('formContainer') formContainer!: ElementRef;

  package = {
    name: '',
    description: '',
    price: null,
    duration: '',
  };

  ngAfterViewInit() {
    gsap.from(this.formContainer.nativeElement, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  onSubmit() {
    if (!this.package.name || !this.package.description || !this.package.price || !this.package.duration) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    console.log('Nuevo paquete creado:', this.package);
    alert(`✅ Paquete "${this.package.name}" creado con éxito`);

    // Reiniciar formulario
    this.package = { name: '', description: '', price: null, duration: '' };
  }
}
