import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
// Importamos HTTP_INTERCEPTORS y withInterceptorsFromDi
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';

import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

// Importamos el interceptor que hemos creado
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),

    // 1. Cambiamos provideHttpClient para usar withInterceptorsFromDi().
    //    Esto es necesario para que el provider HTTP_INTERCEPTORS funcione correctamente.
    provideHttpClient(withInterceptorsFromDi()),

    // 2. Registramos el Interceptor en el array de providers.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Es crucial para permitir que Angular use más de un interceptor.
    }
  ]
};