import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
// Asegúrate de que esta ruta sea correcta en tu proyecto real
import { AdminPackageService, Package } from '../../../services/packages'; 
import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-packages-list',
  standalone: true,
  // Importar HttpClientModule para que el servicio sea inyectable
  imports: [CommonModule, HttpClientModule],
  templateUrl: './packages-list-component.html',
})
export class PackagesListComponent implements OnInit, AfterViewInit {
  // QueryList de las tarjetas de paquetes (mantenido para las animaciones de toggle/delete)
  @ViewChildren('packageCard') packageCards!: QueryList<ElementRef>;

  // Inicializar packages con un array vacío de tipo Package
  packages: Package[] = [];
  filteredPackages: Package[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  // Se elimina initialAnimationDone

  constructor(
    private packageService: AdminPackageService,
    private cdr: ChangeDetectorRef // Inyectado para forzar la detección de cambios si fuera necesario
  ) {}

  /**
   * Carga la lista de paquetes al inicializar el componente.
   */
  ngOnInit(): void {
    this.loadPackages();
  }

  /**
   * Se elimina la lógica de suscripción a changes en ngAfterViewInit, ya no es necesaria.
   */
  ngAfterViewInit() {
    // Lógica de ngAfterViewInit limpia:
  }

  /**
   * Obtiene todos los paquetes de la API.
   */
  loadPackages() {
    this.isLoading = true;
    this.errorMessage = null;
    this.packageService.findAllPackages().subscribe({
      next: (data) => {
        // Simulación: Asignar usersCount si la API no lo hace (quitar en producción)
        const enrichedData = data.map(p => ({ ...p, usersCount: p.id * 10 })); 
        
        this.packages = enrichedData;
        this.filteredPackages = [...this.packages];
        this.isLoading = false;
        this.cdr.detectChanges();
        // Se elimina la lógica de animación inicial
      },
      error: (err) => {
        console.error('Error al cargar paquetes', err);
        // Si el estado es 0, es probable que sea CORS o servidor apagado
        if (err.status === 0) {
            this.errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000.';
        } else {
            this.errorMessage = 'Error en la API. Inténtalo de nuevo más tarde.';
        }
        this.isLoading = false;

      }
    });
  }

  /**
   * Se elimina la función animateCards ya que solo se usaba para la carga y el filtro.
   */
  /* private animateCards(targets: HTMLElement[]) {
    if (targets.length === 0) {
        gsap.killTweensOf(targets);
        return;
    }
    gsap.killTweensOf(targets);
    gsap.fromTo(
      targets,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
    );
  } */

  /**
   * Filtra los paquetes. Se mantiene el setTimeout(0) y cdr.detectChanges() 
   * si se desea mantener una detección de cambios más rápida en la lista filtrada, 
   * pero se elimina la llamada a animateCards.
   * @param event Evento de entrada del buscador.
   */
  filterPackages(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPackages = this.packages.filter(p =>
      p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
    );

    // Se mantiene el setTimeout(0) para asegurar la actualización del DOM si es necesario,
    // pero se elimina la animación.
    setTimeout(() => {
        this.cdr.detectChanges(); 
    }, 0);
  }

  /**
   * Cambia el estado 'isActive' del paquete.
   * @param pkg El paquete a modificar.
   */
  toggleActive(pkg: Package) {
    const newStatus = !pkg.isActive;
    const index = this.filteredPackages.indexOf(pkg);
    if (index === -1) return; // Evitar errores si el elemento no está en la lista visible
    
    const target = this.packageCards.toArray()[index].nativeElement;

    // Llama al servicio de actualización
    this.packageService.updatePackage(pkg.id, { isActive: newStatus }).subscribe({
      next: () => {
        // Actualiza el estado local solo si la API fue exitosa
        pkg.isActive = newStatus;

        // Mantenemos la animación de feedback visual
        gsap.to(target, {
          backgroundColor: newStatus ? '#dcfce7' : '#fee2e2',
          scale: 1.05,
          duration: 0.4,
          ease: 'power1.out',
          yoyo: true,
          repeat: 1,
        });
      },
      error: (err) => {
        console.error('Error al actualizar estado', err);
        // Manejo de errores visual aquí si es necesario
      }
    });
  }

  /**
   * Elimina un paquete de la base de datos y de la vista.
   * @param pkg El paquete a eliminar.
   */
  deletePackage(pkg: Package) {
    const index = this.filteredPackages.indexOf(pkg);
    if (index === -1) return;

    const target = this.packageCards.toArray()[index].nativeElement;

    // Llama al servicio de eliminación
    this.packageService.deletePackage(pkg.id).subscribe({
      next: () => {
        // Mantenemos la animación de salida
        gsap.to(target, {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'power1.in',
          onComplete: () => {
            // Elimina de las listas locales después de la animación y la eliminación de la API
            this.packages = this.packages.filter(p => p.id !== pkg.id);
            this.filteredPackages = this.filteredPackages.filter(p => p.id !== pkg.id);
          },
        });
      },
      error: (err) => {
        console.error('Error al eliminar paquete', err);
        // Manejo de errores visual aquí si es necesario
      }
    });
  }
}