import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../custom-input.component/custom-input.component';


@Component({
  selector: 'app-contacto-form',
  standalone: true,
  imports: [CommonModule, CustomInputComponent],
  templateUrl: './contacto-form.html',
})
export class ContactoForm {
  handleSubmit() {
    console.log('Formulario enviado!');
  }
}
