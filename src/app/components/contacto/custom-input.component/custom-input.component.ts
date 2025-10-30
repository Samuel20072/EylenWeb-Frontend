import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-input-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-input.component.html',
})
export class CustomInputComponent {
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() type: string = 'text';
}
