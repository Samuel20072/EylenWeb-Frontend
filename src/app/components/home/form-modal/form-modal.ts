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
  import { HttpClient } from '@angular/common/http';
  import {
    UserPackageService,
    CreatePackagePurchaseDto,
  } from '../../../services/packages'; // Importamos el servicio y el DTO
  import { catchError, of, finalize } from 'rxjs';
  import { ConfirmationModal } from '../../confirmation-modal-component/confirmation-modal-component';
  import { StatusModal } from '../../message-modal-component/message-modal-component'
  
  @Component({
    selector: 'app-form-modal',
    standalone: true,
    imports: [FormsModule, CommonModule, ConfirmationModal,StatusModal], // <--- AÑADIDO: Incluir el modal en imports
    templateUrl: './form-modal.html', // Referencia al archivo HTML
  })
  export class FormModal implements OnInit, AfterViewInit, OnChanges {
    // Asumimos que el paquete tiene 'id', 'title' o 'name' y 'value' (monto)
    @Input() selectedPackage: any = null;
    @Input() isOpen = false;
    // Se elimina @Input() userId. Ahora se obtendrá localmente.
    @Output() close = new EventEmitter<void>();
  
    @ViewChild('modal') modal!: ElementRef;
    @ViewChild('overlay') overlay!: ElementRef;
  
    selectedFile: File | null = null;
    isLoading = false; // Indicador de carga para la solicitud API
    message = ''; // Mensaje de éxito/error
  
    isConfirmationOpen = false; // Estado para el modal de confirmación
  
    // Datos del formulario (amount ahora será una cadena formateada para display)
    formData = {
      name: '',
      email: '',
      phone: '',
      paymentMethod: '',
      amount: '', // Almacena el valor formateado (ej: "$10,000 COP")
      message: '', // Usaremos este campo como 'notes' para el DTO
    };
  
    private hasOpenedOnce = false;
  
    // --- CONFIGURACIÓN DE CLOUDINARY ELIMINADA ---
    // El backend (NestJS) ahora es responsable de la subida a Cloudinary,
    // lo que soluciona el error de CORS y de seguridad.
    // ---------------------------------------------
  
    // Inyectamos el servicio
    constructor(
      private userPackageService: UserPackageService,
      private http: HttpClient, // Se mantiene por si se usa en otros lugares, aunque ya no para Cloudinary
    ) {}
  
    ngOnInit() {}
  
    ngAfterViewInit() {
      if (this.isOpen) {
        this.animateOpen();
        this.hasOpenedOnce = true;
      }
    }
  
    // Función para formatear el valor numérico a moneda
    private formatCurrency(value: number | string): string {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) return '';
      // Formato para pesos colombianos (COP)
      return num.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
  
    /**
     * Obtiene el ID del usuario desde el localStorage.
     * Asume que la clave 'user' en localStorage contiene un objeto JSON con la propiedad 'id'.
     * @returns El ID del usuario o null si no se encuentra.
     */
    private getUserIdFromLocalStorage(): string | null {
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          // Aseguramos que el ID es una cadena
          return user?.id?.toString() ?? null;
        }
        return null;
      } catch (e) {
        console.error('Error al parsear el usuario de localStorage:', e);
        return null;
      }
    }
  
    ngOnChanges(changes: SimpleChanges) {
      // Verificar si la propiedad 'isOpen' ha cambiado a true o si 'selectedPackage' ha cambiado
      const packageChanged = changes['selectedPackage'];
      const isOpenChangedToTrue = changes['isOpen'] && changes['isOpen'].currentValue === true;
  
      if (isOpenChangedToTrue) {
        // Lógica de limpieza y animación al abrir
        this.message = '';
        this.isLoading = false;
        this.isConfirmationOpen = false; // Asegurar que la confirmación esté cerrada al abrir el modal principal
        this.selectedFile = null;
        
        setTimeout(() => {
          this.animateOpen();
          this.hasOpenedOnce = true;
        }, 0);
      }
  
      // Lógica para actualizar el monto cuando el modal se abre o el paquete cambia
      if (packageChanged || isOpenChangedToTrue) {
        // Se verifica que selectedPackage y su propiedad 'value' existan
        if (this.selectedPackage && this.selectedPackage.value) {
          // Formatear el valor del paquete y asignarlo al campo de monto del formulario
          this.formData.amount = this.formatCurrency(this.selectedPackage.value);
        } else {
          this.formData.amount = ''; // Limpiar si no hay paquete
        }
      }
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
  
    // Función de subida a Cloudinary ELIMINADA, ya no es necesaria.
    // El backend manejará la subida y la URL.
  
    // Paso 1: Abrir el modal de confirmación antes de enviar
    async onSubmit(event: Event) {
      event.preventDefault();
      this.message = '';
  
      if (!this.selectedFile) {
        this.message = 'Por favor, sube el comprobante antes de enviar.';
        return;
      }
  
      if (!this.selectedPackage?.id) {
        this.message = 'Error: No se ha seleccionado un paquete válido.';
        return;
      }
  
      // Nota: La autenticación JWT en el backend verificará el usuario,
      // pero mantenemos la verificación local para UX básica.
      const currentUserId = this.getUserIdFromLocalStorage();
  
      if (!currentUserId) {
        this.message = 'Error: No se pudo identificar al usuario para la compra. Por favor, asegúrate de estar logueado.';
        return;
      }
  
      // Abrir el modal de confirmación
      this.isConfirmationOpen = true;
    }
  
    // Paso 2: Ejecutar la lógica de compra si el usuario confirma
    async confirmSubmission() {
      this.isConfirmationOpen = false; // Cerrar el modal de confirmación
  
      this.isLoading = true;
  
      // Obtenemos el ID del paquete y las notas
      const packageId = this.selectedPackage.id;
      const notes = this.formData.message;
  
      try {
        this.message = 'Enviando comprobante y registrando compra en el sistema...';
  
        // CAMBIO CLAVE: Llamar al servicio, enviando el archivo y las notas directamente.
        // El servicio ahora creará el FormData y lo enviará al endpoint de NestJS.
        this.userPackageService
          .purchasePackage(packageId, this.selectedFile!, notes)
          .pipe(
            catchError((error) => {
              console.error('Error al registrar la compra:', error);
              // Mostrar un mensaje de error más específico para el usuario
              this.message = `Error al registrar la compra. Detalles: ${error.message || 'Error de conexión o validación.'}`;
              return of(null);
            }),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe((purchase) => {
            if (purchase) {
              this.message = 'Comprobante enviado y compra registrada correctamente ✅';
              // Cierra el modal principal después de un breve momento de éxito
              setTimeout(() => this.closeModal(), 1500);
            }
          });
      } catch (e: any) {
        console.error('Error durante el envío o registro:', e);
        this.message = `Ocurrió un error: ${e.message || 'Error desconocido'}.`;
        this.isLoading = false;
      }
    }
  
    // Manejar la cancelación desde el modal de confirmación
    cancelSubmission() {
      this.isConfirmationOpen = false;
      this.message = 'Envío cancelado. Por favor, confirma cuando estés listo.';
    }
  
    // Manejar el cierre del modal de confirmación (similar a cancelar)
    closeConfirmation() {
      this.isConfirmationOpen = false;
    }
  
    // ✨ Animación y cierre del modal: EMITIR al padre en onComplete
    closeModal() {
      // Aseguramos que la animación solo se ejecuta si no estamos cargando
      if (this.isLoading) return;
  
      if (!this.modal || !this.overlay) {
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
          this.close.emit();
        },
      });
    }
  }