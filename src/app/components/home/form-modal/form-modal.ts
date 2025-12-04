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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  UserPackageService,
  // CreatePackagePurchaseDto,
} from '../../../services/packages';
import { catchError, of, finalize } from 'rxjs';
import { ConfirmationModal } from '../../confirmation-modal-component/confirmation-modal-component';
import { StatusModal } from '../../message-modal-component/message-modal-component'

// --- 🚀 IMPORTACIÓN DEL SERVICIO DE NOTIFICACIONES Y DTO ---
import { NotificationsService, CreateNotificationDto } from '../../../services/notification';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ConfirmationModal,StatusModal],
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
  message = ''; // Mensaje de éxito/error (para el área de carga/estado en el form)

  isConfirmationOpen = false; // Estado para el modal de confirmación

  // 🚀 ESTADOS PARA EL MODAL DE ERROR (StatusModal)
  isErrorModalOpen = false;
  errorModalMessage = '';
  errorModalTitle = 'Error de Compra';
  
  // 🚀 ESTADOS PARA EL MODAL DE ÉXITO (StatusModal)
  isSuccessModalOpen = false;
  successModalMessage = '¡Comprobante enviado con éxito!'; // Mensaje de éxito
  successModalTitle = 'Compra Registrada';
  // -----------------------------------------------------

  // Datos del formulario (amount ahora será una cadena formateada para display)
  formData = {
    name: '', // <-- Nombre del usuario que realiza la compra
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

  // Inyectamos los servicios
  constructor(
    private userPackageService: UserPackageService,
    private http: HttpClient,
    private notificationsService: NotificationsService, // <-- 🚀 INYECCIÓN DEL NUEVO SERVICIO
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
      
      // Limpiar estados de los modales de estado
      this.isErrorModalOpen = false;
      this.errorModalMessage = '';
      this.isSuccessModalOpen = false; // Limpiar éxito también

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
    this.message = 'Enviando comprobante y registrando compra en el sistema...'; // Mensaje de carga

    // Obtenemos el ID del paquete y las notas
    const packageId = this.selectedPackage.id;
    const notes = this.formData.message;

    const userName = this.formData.name || 'Usuario Desconocido'; // Obtener el nombre del formulario

    this.userPackageService
      .purchasePackage(packageId, this.selectedFile!, notes)
      .pipe(
        catchError((error: HttpErrorResponse) => { // Tipamos el error como HttpErrorResponse
          console.error('Error al registrar la compra:', error);
          
          // 🚀 MODIFICACIÓN: USANDO EL MODAL DE ESTADO PARA ERRORES CRÍTICOS
          let extractedMessage = 'Ocurrió un error desconocido o de conexión.';
          let title = 'Error de Compra';

          // 1. Intentamos acceder al mensaje de error detallado del backend (NestJS format)
          if (error.error && typeof error.error === 'object' && error.error.message) {
            // Si es un array (errores de validación) o una cadena.
            extractedMessage = Array.isArray(error.error.message) 
                              ? error.error.message.join('; ') 
                              : error.error.message;
          } 
          // 2. Si es una cadena simple, la usamos (ej: algunos errores de validación)
          else if (typeof error.error === 'string' && error.error.length > 0) {
            extractedMessage = error.error;
          }
          // 3. Fallback al mensaje HTTP (solo si no se encontró un mensaje más amigable)
          else if (error.status !== 0) {
            extractedMessage = `Error de servidor (${error.status}): ${error.statusText}`;
          }

          // El error 409 es el de conflicto (ya tiene un paquete activo)
          if (error.status === 409) {
              title = 'Paquete Activo Detectado';
          }
          
          // Abrir el modal de error con el mensaje extraído
          this.errorModalTitle = title;
          this.errorModalMessage = extractedMessage;
          this.isErrorModalOpen = true;
          this.message = ''; // Limpiar mensaje de carga/éxito del formulario principal
          
          return of(null); // Retorna un Observable que emite null y completa.
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((purchase) => {
        if (purchase) {
          // 🚀 CASO DE ÉXITO: Mostrar el modal de éxito y crear la notificación
          const packageTitle = this.selectedPackage.name || this.selectedPackage.title;
          
          // Mensaje de éxito para el usuario (front-end)
          const successMessage = `¡Comprobante de compra enviado correctamente para el paquete ${packageTitle}! Tu solicitud está pendiente de aprobación por el equipo.`;
          
          // 1. Intentar crear la notificación (para el administrador)
          const currentUserId = this.getUserIdFromLocalStorage();

          // **********************************************
          // 🛑 CORRECCIÓN DE ERROR 400: Validación estricta de userId
          // **********************************************
          const userIdInt = currentUserId ? parseInt(currentUserId, 10) : NaN;
          
          // Verificar que el ID sea un número entero válido (mayor que 0)
          if (!isNaN(userIdInt) && userIdInt > 0) { 
              // --- 🚀 CONSTRUCCIÓN DE LA NOTIFICACIÓN PARA EL ADMIN (MENSAJE FIJO) ---
              const notificationTitle = `Nuevo Comprobante de Pago Recibido`;
              
              // Mensaje fijo y simple solicitado por el usuario
              const notificationDescription = 
                  `Se ha recibido un nuevo comprobante de pago de parte de ${userName} que requiere verificación. El usuario no necesita realizar ninguna acción adicional.`;
              
              // El DTO ahora usa 'title' gracias a la corrección en el servicio
              const notificationDto: CreateNotificationDto = {
                  title: notificationTitle, 
                  description: notificationDescription,
                  // Usamos el ID parseado y validado
                  user_id: userIdInt, 
              };

              this.notificationsService.create(notificationDto).subscribe({
                  next: () => console.log('✅ Notificación de compra creada con éxito.'),
                  // Manejamos el error de notificación silenciosamente.
                  error: (err) => console.error('❌ Error al crear la notificación:', err), 
              });
              // -----------------------------------------------------
          } else {
            console.error('❌ No se pudo crear la notificación: User ID inválido o no encontrado para el destinatario.');
          }

          // 2. Mostrar modal de éxito (al usuario)
          this.successModalMessage = successMessage;
          this.isSuccessModalOpen = true;
          this.message = ''; // Limpiar mensaje del formulario
          
          // 3. Cierra el modal principal (Formulario) para que solo quede visible el StatusModal
          this.closeModal();
        }
        // Si 'purchase' es null, significa que catchError se ejecutó y ya mostramos el modal de error.
      });
  }

  // Manejador para cerrar el modal de error
  closeErrorModal() {
    this.isErrorModalOpen = false;
    this.errorModalMessage = '';
  }
  
  // Manejador para cerrar el modal de éxito (similar a error, solo limpia el estado)
  closeSuccessModal() {
    this.isSuccessModalOpen = false;
    this.successModalMessage = '';
    // No necesitamos this.close.emit() aquí ya que se llama en closeModal()
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