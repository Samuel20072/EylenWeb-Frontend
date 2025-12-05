import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';

/**
 * 🛠️ Tipado para la Gestión de Clases Programadas
 */

export enum ScheduledClassStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface ScheduledClass {
  id: number;
  user_id: number;
  package_purchase_id: number;
  schedule_date: string;
  status: ScheduledClassStatus;
  notes: string | null;

  // Propiedades adicionales
  date?: string;
  time?: string;

  // Propiedades de BaseEntity
  createdAt: string;
  updatedAt: string;

  // Relaciones (si el backend las devuelve)
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateScheduledClassDto {
  user_id: number;
  package_purchase_id: number;
  schedule_date: string;
  notes?: string;
}

export type UpdateScheduledClassDto = Partial<CreateScheduledClassDto> & {
  status?: ScheduledClassStatus;
};

@Injectable({
  providedIn: 'root'
})
export class ScheduledClassesService {
  private readonly baseUrl = `${environment.apiUrl}/scheduled-classes`;

  constructor(private http: HttpClient) { }

  create(dto: CreateScheduledClassDto): Observable<ScheduledClass> {
    return this.http.post<ScheduledClass>(this.baseUrl, dto);
  }

  findAll(): Observable<ScheduledClass[]> {
    return this.http.get<ScheduledClass[]>(this.baseUrl);
  }

  findOne(id: number): Observable<ScheduledClass> {
    return this.http.get<ScheduledClass>(`${this.baseUrl}/${id}`);
  }

  update(id: number, dto: UpdateScheduledClassDto): Observable<ScheduledClass> {
    return this.http.patch<ScheduledClass>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Get user's scheduled classes
  getMyScheduledClasses(): Observable<ScheduledClass[]> {
    return this.http.get<ScheduledClass[]>(`${this.baseUrl}/my-classes`);
  }

  // Get available time slots for a specific date
  getAvailableSlots(date: string): Observable<{ availableSlots: string[] }> {
    return this.http.get<{ availableSlots: string[] }>(`${this.baseUrl}/available-slots?date=${date}`);
  }
}