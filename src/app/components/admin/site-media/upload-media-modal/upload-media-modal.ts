import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SitieMediaService } from '../../../../services/sitie-media';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-upload-media-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  // Nota: Asumiendo que './upload-media-modal.html' apunta al Canvas que modificamos.
  templateUrl: './upload-media-modal.html', 
})
export class UploadMediaModalComponent implements OnInit {
  
  @Input() mediaType: 'image' | 'video' = 'image';
  @Output() closeModal = new EventEmitter<boolean>(); 
  
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  uploadError: string | null = null;
  fileError: string | null = null;
  
  // NUEVO: Estado para alternar entre subida local y por URL
  uploadMode: 'local' | 'url' = 'local'; 

  // Define el límite de tamaño de archivo (Ejemplo: 10MB)
  private readonly MAX_FILE_SIZE_MB = 10; 

  constructor(private fb: FormBuilder, private mediaService: SitieMediaService) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      section: ['', Validators.required],
      type: [this.mediaType, Validators.required],
      is_active: [true],
      // NUEVO: Control para la URL remota
      remoteUrl: [''], 
    });
    
    // Aplicar la validación inicial (por defecto 'local')
    this.setupValidation(this.uploadMode);
  }

  /**
   * Cambia el modo de subida (local/url) y ajusta los validadores.
   */
  setUploadMode(mode: 'local' | 'url'): void {
    this.uploadMode = mode;
    this.setupValidation(mode);
  }
  
  /**
   * Configura la validación condicional para 'remoteUrl' basado en el modo.
   */
  setupValidation(mode: 'local' | 'url'): void {
    const remoteUrlControl = this.uploadForm.get('remoteUrl') as AbstractControl;

    if (mode === 'url') {
      // MODO URL: remoteUrl es requerido y debe ser una URL.
      remoteUrlControl.setValidators([Validators.required, Validators.pattern('https?://.*')]);
      // Asegurar que no haya errores de archivo local si cambiamos a URL
      this.selectedFile = null; 
      this.fileError = null;
    } else {
      // MODO LOCAL: remoteUrl no es requerido y su valor se limpia.
      remoteUrlControl.clearValidators();
      remoteUrlControl.setValue('');
    }

    remoteUrlControl.updateValueAndValidity();
    // Forzamos la re-validación de todo el form.
    this.uploadForm.updateValueAndValidity(); 
  }

  /**
   * Captura el archivo seleccionado del input file y valida su tipo y tamaño.
   */
  onFileSelected(event: Event): void {
    this.fileError = null;
    this.selectedFile = null;
    
    // Si se selecciona un archivo, forzamos el modo 'local'
    this.setUploadMode('local'); 

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // 1. Validación de tipo de archivo
      if (this.mediaType === 'image' && !file.type.startsWith('image/')) {
        this.fileError = 'Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF).';
        return;
      }
      if (this.mediaType === 'video' && !file.type.startsWith('video/')) {
        this.fileError = 'Por favor, selecciona un archivo de video válido.';
        return;
      }

      // 2. Validación de tamaño de archivo
      if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) { 
        this.fileError = `El archivo es demasiado grande (máx. ${this.MAX_FILE_SIZE_MB}MB). Para videos grandes, use la opción "Importar por URL".`;
        return;
      }

      this.selectedFile = file;
    }
  }
  
  /**
   * Valida la forma basándose en el modo de subida activo.
   */
  isFormValid(): boolean {
    // Validación base: title y section deben ser válidos
    const baseValid = this.uploadForm.get('title')?.valid && this.uploadForm.get('section')?.valid;

    if (!baseValid) {
        return false;
    }

    if (this.uploadMode === 'local') {
        // Modo Local: requiere un archivo seleccionado y sin errores
        return !!this.selectedFile && !this.fileError;
    } else {
        // Modo URL: requiere que el campo remoteUrl sea válido
        return this.uploadForm.get('remoteUrl')?.valid || false;
    }
  }
  
  /**
   * Envía el formulario. Llama a uploadMedia o importMediaFromUrl según el modo.
   */
  onSubmit(): void {
    if (!this.isFormValid()) {
      this.uploadForm.markAllAsTouched();
      // Aseguramos que el error de archivo se muestre si es modo local y falta el archivo
      if (this.uploadMode === 'local' && !this.selectedFile) {
          this.fileError = 'Debe seleccionar un archivo.';
      }
      return;
    }

    this.uploading = true;
    this.uploadError = null;
    
    const payload = this.uploadForm.value;

    if (this.uploadMode === 'local' && this.selectedFile) {
        // MODO LOCAL: Subir archivo
        this.mediaService.uploadMedia(payload, this.selectedFile)
            .pipe(first())
            .subscribe({
                next: () => this.handleSuccess(),
                error: (err: any) => this.handleError(err)
            });
    } else if (this.uploadMode === 'url' && payload.remoteUrl) {
        // MODO URL: Importar desde URL
        // Asumimos que el servicio tiene un método llamado importMediaFromUrl para manejar esto
        this.mediaService.importMediaFromUrl(payload)
            .pipe(first())
            .subscribe({
                next: () => this.handleSuccess(),
                error: (err: any) => this.handleError(err)
            });
    }
  }

  private handleSuccess(): void {
    this.uploading = false;
    this.close(true); // Cerrar y notificar éxito
  }
  
  private handleError(err: any): void {
    console.error('Error durante la operación:', err);
    this.uploadError = err.error?.message || 'Error al procesar el archivo/URL. Intente de nuevo.';
    this.uploading = false;
  }

  /**
   * Cierra el modal y notifica al padre el resultado.
   * @param success Indica si la subida fue exitosa.
   */
  close(success: boolean): void {
    this.closeModal.emit(success);
  }
}