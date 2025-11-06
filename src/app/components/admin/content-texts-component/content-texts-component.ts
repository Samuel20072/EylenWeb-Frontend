import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-texts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-texts-component.html',
})
export class ContentTextsComponent {
  texts = [
    { id: 1, section: 'Inicio', content: 'Bienvenida al sitio oficial de Eylen.' },
    { id: 2, section: 'Sobre mí', content: 'Soy Eylen, instructora apasionada por el movimiento.' },
    { id: 3, section: 'Contacto', content: 'Puedes escribirme a contacto@eylen.com.' },
  ];

  editingId: number | null = null;
  editedContent: string = '';

  editText(text: any) {
    this.editingId = text.id;
    this.editedContent = text.content;
  }

  saveText(text: any) {
    if (this.editedContent.trim()) {
      text.content = this.editedContent.trim();
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedContent = '';
  }
}
