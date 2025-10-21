import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
  styleUrls: ['./button.css']
})
export class ButtonComponent {
  @Input() text: string = 'Botón';
  @Input() color: string = '#c63d3d';
  @Input() hoverColor: string = '#a32f2f';
  @Input() font: string = 'poppins';
  @Input() fontWeight: string = 'semibold';
  @Input() link: string = '';
  @Input() type: 'button' | 'link' = 'button';
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    if (this.type === 'button') {
      this.onClick.emit();
    }
  }

  get buttonStyles() {
    return {
      'background-color': this.color,
      'hover:background-color': this.hoverColor,
      'font-family': this.font,
      'font-weight': this.fontWeight
    };
  }
}
