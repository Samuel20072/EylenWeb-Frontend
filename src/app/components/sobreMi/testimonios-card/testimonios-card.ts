import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonios-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonios-card.html',
  styleUrl: './testimonios-card.css'
})
export class TestimoniosCard {
  @Input() name!: string;
  @Input() text!: string;
  @Input() image!: string;
}
