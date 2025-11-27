import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Si utilizas un AuthService, inyéctalo aquí. 
  // Usaremos localStorage por simplicidad en este ejemplo.
  constructor() {} 

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. Obtener el token (ajusta esto si usas un servicio de autenticación)
    const authToken = localStorage.getItem('token'); 

    // 2. Clonar la solicitud y adjuntar el token si existe
    if (authToken) {
      const authRequest = request.clone({
        setHeaders: {
          // Utiliza 'Bearer' si tu backend lo espera (es el estándar JWT)
          Authorization: `Bearer ${authToken}` 
        }
      });
      // 3. Pasar la solicitud clonada con el encabezado
      return next.handle(authRequest);
    }

    // 4. Si no hay token, pasar la solicitud original
    return next.handle(request);
  }
}