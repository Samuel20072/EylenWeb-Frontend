import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef, 
  AfterViewInit, 
  OnChanges, 
  SimpleChanges 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  // Referencia al archivo HTML
  templateUrl: './confirmation-modal-component.html',
  styles: [`
    .modal-overlay {
      /* Estilos para la capa oscura de fondo */
      @apply fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4;
      /* Inicialmente oculto por JS, pero el componente siempre está en el DOM para la animación */
    }
  
    .modal-content {
      /* Estilos del cuerpo del modal */
      @apply bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7;
      border-top: 6px solid #e11d48; /* ROJO premium */
    }
  
    .btn-confirm {
      /* Estilos para el botón de confirmar */
      @apply w-full py-3 rounded-xl font-bold text-white transition-all;
      background: linear-gradient(90deg, #e11d48, #be123c);
      @apply shadow-lg shadow-rose-200;
    }
    .btn-confirm:hover {
      background: linear-gradient(90deg, #be123c, #9f1239);
      @apply shadow-xl;
    }
  
    .btn-cancel {
      /* Estilos para el botón de cancelar */
      @apply w-full py-3 rounded-xl font-bold text-gray-700 bg-gray-100 transition-all;
    }
    .btn-cancel:hover {
      @apply bg-gray-200;
    }
  `]
})
export class ConfirmationModal implements AfterViewInit, OnChanges {
  // --- Inputs ---
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirmar Acción';
  @Input() message: string = '¿Estás seguro de que quieres continuar con esta acción?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';

  // --- Outputs ---
  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); // Emitir al completar la animación de cierre

  // --- View Children (Referencias a elementos DOM) ---
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;

  constructor() {}

  // Inicializa el estado visual del modal (oculto)
  ngAfterViewInit() {
    if (this.overlay && this.modal) {
        if (!this.isOpen) {
            // Asegura que el modal esté oculto si no debe estar abierto
            gsap.set(this.overlay.nativeElement, { opacity: 0, display: 'none' });
            gsap.set(this.modal.nativeElement, { scale: 0.8, opacity: 0 });
        } else {
            // Si empieza abierto, asegúrate de que esté visible y animado
            this.animateOpen();
        }
    }
  }

  // Detecta el cambio de estado de 'isOpen'
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      // Necesitamos verificar que los elementos ya existan antes de llamar a GSAP
      if (!this.modal || !this.overlay) return; 

      if (changes['isOpen'].currentValue === true) {
        this.animateOpen();
      } else if (changes['isOpen'].previousValue === true && changes['isOpen'].currentValue === false) {
        this.animateClose();
      }
    }
  }

  // Animación de apertura con GSAP
  private animateOpen() {
    if (!this.modal || !this.overlay) return;
    
    // 1. Mostrar el contenedor (overlay)
    gsap.set(this.overlay.nativeElement, { display: 'flex' });
    
    // 2. Animación de entrada
    gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.3 });
    gsap.fromTo(this.modal.nativeElement, 
      { scale: 0.8, opacity: 0, y: 10 }, 
      { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );
  }

  // Animación de cierre con GSAP
  private animateClose() {
    // 🛑 Esta verificación es la clave para evitar el TypeError en onComplete 🛑
    // Si los elementos ya no existen (debido a una destrucción muy rápida), salimos.
    if (!this.modal || !this.overlay) return;

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
        // 3. Ocultar el contenedor con display: 'none' al finalizar la animación
        gsap.set(this.overlay.nativeElement, { display: 'none' });
        // Informar al padre que el cierre (animado) ha terminado
        this.close.emit();
      } 
    });
  }

  // Lógica al confirmar: emite el evento y espera que el padre cambie [isOpen]
  onConfirm() {
    this.confirmed.emit();
  }

  // Lógica al cancelar: emite el evento y espera que el padre cambie [isOpen]
  onCancel() {
    this.canceled.emit();
  }
}