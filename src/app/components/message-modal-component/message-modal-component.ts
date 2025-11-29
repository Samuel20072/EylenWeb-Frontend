import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef, 
  AfterViewInit, 
  OnChanges, 
  SimpleChanges, 
  OnDestroy // Agregado para limpiar el setTimeout
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common'; // Usamos NgClass en el template
import { gsap } from 'gsap';

@Component({
  selector: 'app-status-modal',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './message-modal-component.html',
  styles: [`
    /* Estilos generales idénticos para consistencia */
    .modal-overlay {
      @apply fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4;
    }
  
    .modal-content {
      @apply bg-white rounded-3xl shadow-2xl max-w-xs w-full p-7;
      border-top: 6px solid; /* El color del borde se define por el estado */
      @apply border-green-600; /* Default: verde */
    }

    /* Estilo del botón de cerrar */
    .btn-close {
      @apply w-full py-3 rounded-xl font-bold text-white transition-all mt-4;
      background: linear-gradient(90deg, #10b981, #059669); /* Default: Verde para cerrar */
      @apply shadow-lg shadow-green-200;
    }
    .btn-close:hover {
      background: linear-gradient(90deg, #059669, #047857);
      @apply shadow-xl;
    }
    
    /* Adaptar estilos de borde y botón basados en el estado (se hace mejor con NgClass en el template) */
    .modal-content[data-status="error"] {
        @apply border-red-600;
    }
    .modal-content[data-status="error"] .btn-close {
        background: linear-gradient(90deg, #ef4444, #dc2626); 
        @apply shadow-lg shadow-red-200;
    }
    .modal-content[data-status="error"] .btn-close:hover {
        background: linear-gradient(90deg, #dc2626, #b91c1c);
    }
  `]
})
export class StatusModal implements AfterViewInit, OnChanges, OnDestroy {
  // --- Inputs ---
  @Input() isOpen: boolean = false;
  @Input() status: 'success' | 'error' = 'success'; // Nuevo Input para el estado
  @Input() title: string = '¡Éxito!';
  @Input() message: string = 'La acción se completó correctamente.';
  @Input() closeText: string = 'Aceptar';
  @Input() autoCloseDelay: number = 3000; // 3 segundos

  // --- Outputs ---
  @Output() close = new EventEmitter<void>();

  // --- View Children ---
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;

  private autoCloseTimeout: any;

  // --- Lifecycle ---
  
  constructor() {}

  ngAfterViewInit() {
    if (this.overlay && this.modal) {
        if (!this.isOpen) {
            gsap.set(this.overlay.nativeElement, { opacity: 0, display: 'none' });
            gsap.set(this.modal.nativeElement, { scale: 0.8, opacity: 0 });
        } else {
            this.animateOpen();
        }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (!this.modal || !this.overlay) return; 

      if (changes['isOpen'].currentValue === true) {
        this.animateOpen();
      } else if (changes['isOpen'].previousValue === true && changes['isOpen'].currentValue === false) {
        this.animateClose();
      }
    }
  }

  ngOnDestroy(): void {
    // Es CRUCIAL limpiar el timeout al destruir el componente
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  }

  // --- Animation Logic ---

  private animateOpen() {
    if (!this.modal || !this.overlay) return;

    // 1. Limpiar el timeout anterior (si existe)
    if (this.autoCloseTimeout) {
        clearTimeout(this.autoCloseTimeout);
    }
    
    // 2. Mostrar el contenedor
    gsap.set(this.overlay.nativeElement, { display: 'flex' });
    
    // 3. Animación de entrada
    gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.3 });
    gsap.fromTo(this.modal.nativeElement, 
      { scale: 0.8, opacity: 0, y: 10 }, 
      { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );

    // 4. Configurar el auto-cierre
    this.autoCloseTimeout = setTimeout(() => {
        // Solo emitimos 'close' si el modal aún está marcado como abierto por el padre
        this.close.emit(); 
    }, this.autoCloseDelay);

    // 5. Aplicar el color de borde correcto
    this.modal.nativeElement.setAttribute('data-status', this.status);
  }

  private animateClose() {
    if (!this.modal || !this.overlay) return;
    
    // 1. Limpiar el timeout al iniciar el cierre
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }

    gsap.to(this.modal.nativeElement, { 
      scale: 0.9, 
      opacity: 0, 
      duration: 0.25, 
      ease: 'power2.in' 
    });
    
    gsap.to(this.overlay.nativeElement, { 
      opacity: 0, 
      duration: 0.25, 
      onComplete: () => {
        // Ocultar el contenedor con display: 'none' al finalizar
        gsap.set(this.overlay.nativeElement, { display: 'none' });
      } 
    });
  }

  // Lógica al cerrar manualmente o por el botón
  onClose() {
    // Simplemente emite 'close' y el padre debe cambiar [isOpen] a false.
    this.close.emit();
  }
}