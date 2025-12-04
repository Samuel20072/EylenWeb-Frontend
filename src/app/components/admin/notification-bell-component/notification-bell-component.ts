import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

// Importamos el servicio. Si el servicio exporta su propia interfaz 'Notification',
// es crucial que esa interfaz incluya TODAS las propiedades usadas en el HTML.
// Dado que los errores persisten, reintroducimos la definición COMPLETA aquí 
// para asegurar que la plantilla compile, asumiendo que el servicio la implementa.
import { NotificationsService } from '../../../services/notification'; 


// 🛑 REINTRODUCIMOS LA INTERFAZ COMPLETA
// Esta es la definición que debe existir y ser consistente con el backend y el servicio.
export interface Notification {
  id?: number;
  user_id: number;
  type: string;
  title: string;
  message: string; // Usado en el HTML
  data?: any;
  is_read: boolean; // Usado en el HTML
  fecha_creacion: string; // Usado en el HTML
}


@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell-component.html',
})
export class NotificationBellComponent implements OnInit {
  // Usamos la interfaz local/exportada
  notifications: Notification[] = [];
  errorMessage: string | null = null;
  showPanel = false;

  // Inyectamos el servicio de notificaciones
  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.errorMessage = null; 
    
    // Asumimos que notificationsService.findAll() devuelve Observable<Notification[]>
    // Esto es ahora compatible con la interfaz definida arriba.
    this.notificationsService.findAll()
      .pipe(
        catchError((err) => {
          console.error('Error al cargar las notificaciones:', err);
          this.errorMessage = 'Error al cargar las notificaciones. Intente más tarde.';
          return of([]); 
        })
      )
      .subscribe((data: any) => {
        // Aseguramos que data es tipada como Notification[]
        this.notifications = data;
      });
  }

  toggleNotifications() {
    this.showPanel = !this.showPanel;
    if (this.showPanel) {
      this.loadNotifications(); 
    }
  }

  // Actualizada para aceptar 'fecha_creacion'
  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'hace menos de un minuto';
    if (diffMinutes < 60) return `hace ${diffMinutes} minutos`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `hace ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `hace ${diffDays} días`;
  }
}