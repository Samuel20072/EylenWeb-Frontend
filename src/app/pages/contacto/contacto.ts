import { Component } from '@angular/core';
import {ContactoSection} from '../../components/contacto/contacto-section/contacto-section';
import {ContactoFormSection} from '../../components/contacto/contacto-form-section/contacto-form-section';
import {RedesSection} from '../../components/contacto/redes-section/redes-section';

@Component({
  selector: 'app-contacto',
  imports: [ContactoSection,ContactoFormSection,RedesSection],
  templateUrl: './contacto.html',
})
export class Contacto {

}
