import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Asume que esta ruta apunta a tu archivo de configuración de entorno
import { environment } from '../../environments/environment'; 

// --- Interfaces del Frontend ---

/**
 * Define la estructura de la entidad de texto del sitio tal como la devuelve el backend.
 */
export interface SitieText {
  id: number;
  section: string; // El identificador de la sección (ej. 'home_title', 'footer_contact')
  content: string; // El contenido del texto
  is_active: boolean; // Indica si el texto está activo
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * DTO para la creación de un nuevo texto (POST).
 * Los campos deben coincidir con CreateSitieTextDto del backend.
 */
export interface CreateSitieTextDto {
  section: string;
  content: string;
  is_active?: boolean;
}

/**
 * DTO para la actualización parcial de un texto (PATCH).
 * Todos los campos son opcionales.
 */
export interface UpdateSitieTextDto {
  section?: string;
  content?: string;
  is_active?: boolean;
}

// ------------------------------

@Injectable({
  providedIn: 'root'
})
export class SitieTextService {
  // Configura la URL base usando el endpoint definido en el controlador NestJS: '/site-texts'
  private readonly apiUrl = `${environment.apiUrl}/site-texts`;

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo texto del sitio (POST /site-texts)
   * @param dto Los datos del nuevo texto (section, content, is_active).
   */
  create(dto: CreateSitieTextDto): Observable<SitieText> {
    return this.http.post<SitieText>(this.apiUrl, dto);
  }

  /**
   * Obtiene todos los textos del sitio (GET /site-texts)
   */
  findAll(): Observable<SitieText[]> {
    return this.http.get<SitieText[]>(this.apiUrl);
  }
  
  /**
   * Obtiene un texto del sitio por su ID (GET /site-texts/:id)
   * @param id El identificador único del texto.
   */
  findOne(id: number): Observable<SitieText> {
    return this.http.get<SitieText>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza parcialmente un texto del sitio por su ID (PATCH /site-texts/:id)
   * @param id El identificador único del texto a actualizar.
   * @param dto Los campos a actualizar.
   */
  update(id: number, dto: UpdateSitieTextDto): Observable<SitieText> {
    return this.http.patch<SitieText>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Elimina un texto del sitio por su ID (DELETE /site-texts/:id)
   * @param id El identificador único del texto a eliminar.
   */
  remove(id: number): Observable<void> {
    // Usa <void> ya que las operaciones DELETE típicamente no devuelven contenido
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}