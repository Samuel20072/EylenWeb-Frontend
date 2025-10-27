import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionVisionCard } from '../mission-vision-card/mission-vision-card';

@Component({
  selector: 'app-mission-vision-section',
  standalone: true,
  imports: [CommonModule, MissionVisionCard],
  templateUrl: './mission-vision-section.html'
})
export class MissionVisionSection {
  cards = [
    {
      title: 'Mi Misión',
      content: 'Guiarte desde el movimiento y la consciencia corporal, para que te mires con amor te muevas con libertad, y vuelvas a ti. Con cada clase, te acompaño a reconectar con tu energía femenina y tu placer de vivir.'
    },
    {
      title: 'Mi Visión',
      content: 'Guiarte desde el movimiento y la consciencia corporal, para que te mires con amor te muevas con libertad, y vuelvas a ti. Con cada clase, te acompaño a reconectar con tu energía femenina y tu placer de vivir.'
    }
  ];
}
