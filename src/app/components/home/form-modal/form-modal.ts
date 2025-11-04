import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-modal.html',
})
export class FormModal implements OnInit, AfterViewInit, OnChanges {
  @Input() selectedPackage: any = null; // paquete seleccionado desde paquetes-section
  @Input() isOpen = false; // controlado por el padre
  @Output() close = new EventEmitter<void>(); // notifica al padre que cierre

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;

  selectedFile: File | null = null;

  formData = {
    name: '',
    email: '',
    phone: '',
    paymentMethod: '',
    amount: '',
    message: '',
  };

  // Indicador para saber si ya animamos la apertura (evitar animar antes de ViewInit)
  private hasOpenedOnce = false;

  ngOnInit() {}

  ngAfterViewInit() {
    // Si el modal ya está abierto cuando se creó el componente, animar la apertura
    if (this.isOpen) {
      this.animateOpen();
      this.hasOpenedOnce = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Cuando el padre cambia isOpen a true -> animar apertura
    if (changes['isOpen']) {
      const current = changes['isOpen'].currentValue;
      if (current === true) {
        // Delay a next tick si aún no hay referencias de view
        setTimeout(() => {
          this.animateOpen();
          this.hasOpenedOnce = true;
        }, 0);
      }
    }

    // Si cambia selectedPackage y el modal está abierto, podrías refrescar verificaciones
    // if (changes['selectedPackage'] && this.isOpen) { ... }
  }

  // ✨ Animación de apertura con GSAP
  animateOpen() {
    if (!this.modal || !this.overlay) return;
    gsap.killTweensOf(this.modal.nativeElement);
    gsap.killTweensOf(this.overlay.nativeElement);

    gsap.fromTo(
      this.overlay.nativeElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.25 }
    );

    gsap.fromTo(
      this.modal.nativeElement,
      { scale: 0.9, opacity: 0, y: -10 },
      { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }

  // Manejar selección del comprobante
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  // Enviar comprobante
  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.selectedFile) {
      alert('Por favor sube el comprobante antes de enviar.');
      return;
    }

    const form = new FormData();
    form.append('name', this.formData.name);
    form.append('email', this.formData.email);
    form.append('phone', this.formData.phone);
    form.append('paymentMethod', this.formData.paymentMethod);
    form.append('amount', String(this.formData.amount));
    form.append('packageTitle', this.selectedPackage?.title || '');
    form.append('message', this.formData.message);
    form.append('comprobante', this.selectedFile!);

    // 🔥 Aquí iría tu conexión con el backend usando HttpClient
    console.log('📤 Enviando datos del comprobante:', form);
    alert('Comprobante enviado correctamente ✅');

    // Cerrar modal con animación y notificar al padre cuando termine
    this.closeModal();
  }

  // ✨ Animación y cierre del modal: EMITIR al padre en onComplete
  closeModal() {
    if (!this.modal || !this.overlay) {
      // si no hay refs, emitir inmediatamente
      this.close.emit();
      return;
    }

    gsap.killTweensOf(this.modal.nativeElement);
    gsap.killTweensOf(this.overlay.nativeElement);

    gsap.to(this.modal.nativeElement, {
      scale: 0.95,
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in',
    });

    gsap.to(this.overlay.nativeElement, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        // Emitir al padre para que ponga isModalOpen = false
        this.close.emit();
      },
    });
  }
}
