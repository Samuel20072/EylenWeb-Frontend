import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './custom-input.component.html',
})
export class CustomInputComponent {
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() type: string = 'text';

  // ✔️ Esto ya no dará error
  @Input() control!: AbstractControl<any> | FormControl;
}
