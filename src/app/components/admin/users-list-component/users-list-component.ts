import { Component, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importar DomSanitizer para URLs
import { ChangeDetectorRef } from '@angular/core';


// --- Importación de Servicios e Interfaces ---
// ASUMO que estos imports son correctos en tu estructura de carpetas
import { AdminPackageService, PackagePurchase } from '../../../services/packages'; 

// --- Interfaces del Modelo de Vista ---
interface UserSummary {
  id: number; // ID del Usuario
  purchaseId: number; // ID de la compra (necesario para validar pago)
  name: string;
  email: string;
  package: string; // Nombre del paquete
  nextClass: string; // Próxima clase (Placeholder)
  remaining: number; // Clases restantes 
  progress: number; // Progreso 
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Estado de la compra
  userHasActiveClasses?: boolean; // Indica si ya tiene un paquete activo (opcional)
  payment: {
    amount: number;
    date: string; // Fecha de compra
    validated: boolean;
    proofOfPaymentUrl: string; // URL del comprobante de pago
  };
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule], 
  templateUrl: './users-list-component.html',
  providers: [AdminPackageService]
})
export class UsersListComponent implements OnInit, AfterViewInit {
  @ViewChild('list') list!: ElementRef;
  @ViewChildren('userRow') userRows!: QueryList<ElementRef>;
  @ViewChild('searchInput') searchInput!: ElementRef;

  users: UserSummary[] = [];
  filteredUsers: UserSummary[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  // Estado para el modal de visualización de comprobante
  showProofModal: boolean = false;
  currentProofUrl: SafeResourceUrl = ''; // Usamos SafeResourceUrl
  currentProofName: string = '';


  constructor(
    private router: Router,
    private adminPackageService: AdminPackageService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    // Nota: ngAfterViewInit solo se ejecuta una vez. Para la carga de datos asíncrona, 
    // necesitamos el setTimeout(0) en loadUsers para esperar la actualización de QueryList.
  }
  
  // --- LÓGICA DE CARGA Y MAPEO DE DATOS ---

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = null;

    // 1. Obtener todas las compras
    this.adminPackageService.getPurchases()
      .pipe(
        map((purchases: PackagePurchase[]) => this.mapPurchasesToUserSummary(purchases)),
        catchError((error) => {
          console.error('Error al cargar usuarios/compras:', error);
          this.errorMessage = 'Hubo un error al cargar la lista de pagos. Intente de nuevo.';
          this.isLoading = false;
          return of([]); 
        })
      )
      .subscribe((userSummaries: UserSummary[]) => {
        this.users = userSummaries;
        // Filtramos solo por PENDING por defecto. 
        this.filteredUsers = this.users.filter(u => u.status === 'PENDING');
        this.isLoading = false;
        this.cdr.detectChanges()
        // *************************************************************
        // FIX: Usamos setTimeout(0) para esperar el ciclo de renderizado 
        // y asegurarnos de que this.userRows esté poblado con los nuevos elementos.
        // *************************************************************
        setTimeout(() => {
          // Si hay filas, animamos las filas individuales (que es lo que el usuario vio al interactuar)
          if (this.userRows.length > 0) {
            const rows = this.userRows.map((r) => r.nativeElement);
            gsap.fromTo(
              rows,
              { opacity: 0, y: 20 }, // Animación de entrada suave
              { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
            );
          } else if (this.list) {
            // Si la lista está vacía, al menos animamos el contenedor
            this.applyInitialAnimation();
          }
        }, 0); 
      });
  }
  private mapPurchasesToUserSummary(purchases: PackagePurchase[]): UserSummary[] {
    return purchases.map(purchase => {
      const remainingClasses = purchase.package?.sessionsCount || 12;

      return {
        id: purchase.userId,
        purchaseId: purchase.id,
        name: purchase.user?.full_name || 'Usuario Desconocido',
        email: purchase.user?.email || 'N/A',
        package: purchase.package?.name || 'Paquete Desconocido',
        nextClass: 'Pendiente', // Placeholder
        remaining: remainingClasses,
        progress: 1, // Full progress if purchase status is not linked to class consumption
        // FIX CLAVE: Convertimos el estado a MAYÚSCULAS para que coincida con el tipo literal ('PENDING')
        status: purchase.status.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED', 
        userHasActiveClasses: purchase.userHasActiveClasses,
        payment: {
          amount: purchase.package?.price || 0,
          date: new Date(purchase.createdAt).toLocaleDateString('es-CO'), 
          validated: purchase.status.toUpperCase() === 'APPROVED',
          proofOfPaymentUrl: purchase.proofOfPaymentUrl,
        },
      } as UserSummary;
      
    });
  }
  
  // --- LÓGICA DE ANIMACIÓN Y FILTRO ---

  private applyInitialAnimation() {
    // Animación solo para el contenedor (si la lista está vacía)
    gsap.from(this.list.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
    });
  }

    // **********************************************
    // FIX: Método trackBy requerido por el *ngFor
    // **********************************************
  trackByPurchaseId(index: number, user: UserSummary): number {
    return user.purchaseId;
  }

  filterUsers(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    
    // Filtra la lista completa (this.users)
    this.filteredUsers = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.package.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.status.toLowerCase().includes(query) // Permite buscar por status (pending, approved, rejected)
    );

    // Animación de las filas filtradas
    setTimeout(() => {
        const rows = this.userRows.map((r) => r.nativeElement);
        gsap.fromTo(
          rows,
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }
        );
    }, 0);
  }


  // --- LÓGICA DE VALIDACIÓN DE PAGO (API CALL) ---

  private updatePaymentStatus(user: UserSummary, newStatus: 'APPROVED' | 'REJECTED') {
    const target = this.findRowElement(user);
    if (target) {
      gsap.to(target, { opacity: 0.5, duration: 0.3 });
    }
    this.errorMessage = null; // Limpiar errores antes de la llamada

    const apiCall: Observable<PackagePurchase> = newStatus === 'APPROVED' 
      ? this.adminPackageService.validatePurchase(user.purchaseId) 
      : this.adminPackageService.rejectPurchase(user.purchaseId);  

    apiCall.subscribe({
      next: (updatedPurchase) => {
        // Encontrar el objeto original en this.users para mantener la fuente de verdad
        const originalUser = this.users.find(u => u.purchaseId === user.purchaseId);
        if(originalUser) {
            // FIX: Aseguramos que el estado retornado también se mapee a MAYÚSCULAS
            originalUser.status = updatedPurchase.status.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED'; 
            originalUser.payment.validated = originalUser.status === 'APPROVED';
            
            // Forzamos la actualización de la vista y filtros
            // Nota: Llamar a filterUsers con un evento simulado asegura que la lista se re-filtre/re-anime
            this.filterUsers( { target: this.searchInput.nativeElement } as any);
        }

        // 3. Aplicar animación de confirmación
        if (target) {
          const bgColor = newStatus === 'APPROVED' ? '#dcfce7' : '#fee2e2';
          gsap.to(target, {
            opacity: 1,
            backgroundColor: bgColor,
            scale: 1.01,
            duration: 0.5,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
            clearProps: "backgroundColor,scale"
          });
        }
      },
      error: (err) => {
        console.error(`Error al ${newStatus === 'APPROVED' ? 'validar' : 'rechazar'} pago:`, err);
        this.errorMessage = `Error al actualizar el pago de ${user.name}. Consulte la consola.`;
        // Restaurar opacidad si falla
        if (target) {
          gsap.to(target, { opacity: 1, duration: 0.3 });
        }
      }
    });
  }
  
  validatePayment(user: UserSummary) {
    this.updatePaymentStatus(user, 'APPROVED');
  }

  rejectPayment(user: UserSummary) {
    this.updatePaymentStatus(user, 'REJECTED');
  }
  
  // --- Modal para Ver Comprobante ---
  viewProof(user: UserSummary) {
    // Sanitizar la URL para prevenir ataques XSS al usarla en el iframe
    this.currentProofUrl = this.sanitizer.bypassSecurityTrustResourceUrl(user.payment.proofOfPaymentUrl);
    this.currentProofName = `Comprobante de ${user.name} - ${user.package}`;
    this.showProofModal = true;
  }

  closeProofModal() {
    this.showProofModal = false;
    this.currentProofUrl = '';
    this.currentProofName = '';
  }

  // Función auxiliar para obtener el elemento DOM de la fila
  private findRowElement(user: UserSummary): HTMLElement | undefined {
    // Importante: Esto funciona si la fila sigue existiendo en filteredUsers (solo funciona antes de ser filtrada/eliminada de la vista)
    const index = this.filteredUsers.findIndex(u => u.purchaseId === user.purchaseId);
    return this.userRows.toArray()[index]?.nativeElement;
  }

  goToUserDetail(user: UserSummary) {
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