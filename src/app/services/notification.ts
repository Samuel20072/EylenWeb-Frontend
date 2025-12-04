import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  title: string; // <-- CORREGIDO: Usar 'title' en lugar de 'name'
  description?: string;
  user_id: number;
  viewed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationDto {
  title: string; // <-- CORREGIDO: Usar 'title' en lugar de 'name'
  description?: string;
  user_id: number;
}

export interface UpdateNotificationDto {
  title?: string; // <-- CORREGIDO: Usar 'title' en lugar de 'name'
  description?: string;
  viewed?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/notifications';

  /** Crear una notificación */
  create(dto: CreateNotificationDto): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl, dto);
  }

  /** Obtener todas las notificaciones */
  findAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl);
  }

  /** Obtener una notificación por id */
  findOne(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}/${id}`);
  }

  /** Actualizar una notificación */
  update(id: number, dto: UpdateNotificationDto): Observable<Notification> {
    return this.http.patch<Notification>(`${this.baseUrl}/${id}`, dto);
  }

  /** Eliminar una notificación */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}