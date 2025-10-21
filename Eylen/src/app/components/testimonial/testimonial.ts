import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-testimonial',
  imports: [],
  templateUrl: './testimonial.html',
  styleUrl: './testimonial.css'
})
export class Testimonial {
  @Input() name!: string;
  @Input() text!: string;
  @Input() image!: string;
}
