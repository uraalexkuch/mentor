import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js з оптимізацією для Angular 21
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    // Router з новими можливостями Angular 21
    provideRouter(routes, 
      withComponentInputBinding(),  // Дозволяє передачу даних через input()
      withViewTransitions()          // Підтримка View Transitions API
    ), 
    
    // Анімації
    provideAnimationsAsync(),
    
    // HttpClient з підтримкою fetch API
    provideHttpClient(withInterceptors([authInterceptor]), withFetch())
  ]
};
