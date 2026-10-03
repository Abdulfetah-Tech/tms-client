import { ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app.routes";

// ✅ ALL SERVICE PIPELINES REGISTERED GLOBALLY
import { EnrollmentService } from "./services/enrollment.service";
import { CourseService } from "./services/course.service"; 
import { credentialsInterceptor } from "./interceptors/credentials.interceptor";
import { errorInterceptor } from "./interceptors/error.interceptor"; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    
    // LAB 2 & 3 UPDATED: Upgraded HttpClient configuration layout
    provideHttpClient(
      // ✅ LAB 3 FIX: Chains both interceptors in order (Credentials first, then Global Error parsing)
      withInterceptors([credentialsInterceptor, errorInterceptor]),
      
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    
    provideAnimations(),
    
    // ✅ ACTIVE DEPENDENCY CHANNELS
    EnrollmentService,
    CourseService 
  ],
};
