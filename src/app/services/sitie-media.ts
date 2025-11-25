import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Asume la ubicación de tu entorno
import { environment } from '../../environments/environment'; 

// --- Interfaces del Frontend ---
// Define la interfaz de los datos que recibirá el backend (sin el archivo, solo metadata)
export interface CreateMediaData {
  id: number;
  type: 'image' | 'video';
  section: string;
  url: string; // La URL de Cloudinary (solo para el modelo de datos, no para el upload/import)
  title: string;
  is_active: boolean;
  
  // NUEVO: Campo opcional para manejar la URL remota en el payload de importación
  remoteUrl?: string; 
}

// Define la interfaz de la entidad que devuelve el backend
export interface SitieMedia { 
  id: number; // Ahora será visible en VideoMedia
  type: 'image' | 'video';
  section: string;
  url: string; // La URL de Cloudinary
  title: string; // Ahora será visible en VideoMedia
  is_active: boolean;
  // ... otros campos como createdAt, updatedAt
}
// ------------------------------

@Injectable({
  providedIn: 'root'
})
export class SitieMediaService {
  private readonly apiUrl = `${environment.apiUrl}/site-media`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las entradas de media (imágenes/videos)
   */
  findAll(): Observable<SitieMedia[]> {
    // Nota: El backend debe estar configurado para devolver SitieMedia[]
    return this.http.get<SitieMedia[]>(this.apiUrl); 
  }

  /**
   * Sube el archivo y los metadatos al backend (modo local).
   * El backend espera el archivo bajo el campo 'file' en un FormData.
   * @param data Metadatos de la media (title, section, type).
   * @param file Archivo a subir.
   */
  uploadMedia(data: CreateMediaData, file: File): Observable<SitieMedia> {
    const formData = new FormData();
    
    // 1. Adjuntar el archivo, usando 'file' como nombre de campo (el mismo que en FileInterceptor)
    formData.append('file', file, file.name);

    // 2. Adjuntar los metadatos
    formData.append('type', data.type);
    formData.append('section', data.section);
    formData.append('title', data.title);
    
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active.toString());
    }

    // 3. Enviar la solicitud POST
    return this.http.post<SitieMedia>(this.apiUrl, formData);
  }
  
  /**
   * IMPORTA contenido multimedia desde una URL remota (modo URL).
   * Este método resuelve el error TS2339 y usa la ruta /import.
   * El backend recibirá el JSON con la remoteUrl y la enviará a Cloudinary.
   * @param payload Los datos del formulario que incluyen la 'remoteUrl'.
   */
  importMediaFromUrl(payload: CreateMediaData): Observable<SitieMedia> {
    // Aseguramos que solo enviamos los datos relevantes para la importación por URL
    const importData = {
      type: payload.type,
      section: payload.section,
      title: payload.title,
      is_active: payload.is_active,
      remoteUrl: payload.remoteUrl // Campo clave para la importación
    };
    
    // Asumimos que el backend tiene un endpoint específico como POST /site-media/import
    return this.http.post<SitieMedia>(`${this.apiUrl}/import`, importData);
  }
  
  delete(id: number): Observable<void> {
    // Llama al endpoint DELETE /site-media/:id
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}