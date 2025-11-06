import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-images-component.html',
})
export class ContentImagesComponent {
  images = [
    { id: 1, title: 'Banner principal', url: 'assets/banner1.jpg' },
    { id: 2, title: 'Sección clases', url: 'assets/class.jpg' },
  ];

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) alert(`Imagen subida: ${file.name}`);
  }

  deleteImage(id: number) {
    this.images = this.images.filter((i) => i.id !== id);
  }
}
