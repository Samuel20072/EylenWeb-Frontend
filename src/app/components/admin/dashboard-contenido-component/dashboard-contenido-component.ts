import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // ⭐ IMPORTACIÓN CLAVE
import { ContentImagesComponent } from '../content-images-component/content-images-component';
import { ContentVideosComponent } from '../content-videos-component/content-videos-component';
import { ContentTextsComponent } from '../content-texts-component/content-texts-component';

@Component({
  selector: 'app-dashboard-contenido',
  standalone: true,
  // ⭐ Añadimos HttpClientModule a los imports
  imports: [CommonModule, HttpClientModule, ContentImagesComponent, ContentVideosComponent, ContentTextsComponent], 
  templateUrl: './dashboard-contenido-component.html',
})
export class DashboardContenidoComponent {
  activeTab: 'imagenes' | 'videos' | 'textos' = 'imagenes';
}