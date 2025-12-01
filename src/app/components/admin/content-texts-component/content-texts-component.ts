import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs';

// Importamos el servicio y las interfaces
import { 
  SitieText, 
  SitieTextService, 
  CreateSitieTextDto, 
  UpdateSitieTextDto 
} from '../../../services/site-text'; // Asumiendo esta ruta

@Component({
  selector: 'app-content-texts',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './content-texts-component.html',
})
export class ContentTextsComponent implements OnInit {
  
  // Estado de la lista de textos
  texts: SitieText[] = [];
  loading: boolean = false;

  // Estado de edición
  editingId: number | null = null;
  editedContent: string = '';

  // Estado de creación
  isCreating: boolean = false;
  newText: CreateSitieTextDto = { 
    section: '', 
    content: '',
    is_active: true // Asumimos activo por defecto
  };
  
  constructor(private sitieTextService: SitieTextService) {}

  ngOnInit(): void {
    this.loadTexts();
  }

  /**
   * Carga todos los textos del backend.
   */
  loadTexts(): void {
    this.loading = true;
    this.sitieTextService.findAll().pipe(
      catchError(err => {
        console.error('Error cargando textos:', err);
        this.loading = false;
        return [];
      })
    ).subscribe({
      next: (data) => {
        this.texts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en suscripción de carga:', err);
        this.loading = false;
      }
    });
  }

  // --- Lógica de Edición (PATCH) ---

  editText(text: SitieText) {
    this.editingId = text.id;
    this.editedContent = text.content;
    this.cancelCreate(); // Asegura que el modo de creación esté desactivado
  }

  saveText(text: SitieText): void {
    if (this.editedContent.trim() && this.editedContent !== text.content) {
      this.sitieTextService.update(text.id, { content: this.editedContent.trim() }).subscribe({
        next: (updatedText) => {
          // Actualizar el texto en la lista local para reflejar el cambio (idealmente se hace en el findAll, pero esto es más rápido)
          const index = this.texts.findIndex(t => t.id === updatedText.id);
          if (index !== -1) {
            this.texts[index] = updatedText;
          }
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Error al actualizar el texto:', err);
          console.error('No se pudo guardar el texto.');
        }
      });
    } else {
      this.cancelEdit(); // Si no hay cambios o el contenido está vacío, solo cancela.
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedContent = '';
  }

  // --- Lógica de Creación (POST) ---

  startCreate() {
    this.isCreating = true;
    this.cancelEdit(); // Asegura que el modo de edición esté desactivado
    this.newText = { 
      section: '', 
      content: '',
      is_active: true
    };
  }

  saveCreate(): void {
    if (!this.newText.section || !this.newText.content) {
      console.warn('Sección y contenido son requeridos.');
      return;
    }

    this.sitieTextService.create(this.newText).subscribe({
      next: (newText) => {
        this.texts.unshift(newText); // Añadir al principio de la lista
        this.cancelCreate();
      },
      error: (err) => {
        console.error('Error al crear el texto:', err);
        console.error('No se pudo crear el texto.');
      }
    });
  }

  cancelCreate() {
    this.isCreating = false;
  }
  
  // --- Lógica de Eliminación (DELETE) ---

  removeText(id: number): void {
    console.warn(`[ATENCIÓN] Eliminación solicitada para ID: ${id}. Se procede sin diálogo de confirmación.`);

    this.sitieTextService.remove(id).subscribe({
      next: () => {
        // Eliminar del array localmente
        this.texts = this.texts.filter(t => t.id !== id);
        console.log(`Texto con ID ${id} eliminado con éxito.`);
      },
      error: (err) => {
        console.error('Error al eliminar el texto:', err);
        console.error('No se pudo eliminar el texto.');
      }
    });
  }
}