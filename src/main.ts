import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

// ✅ ENVIRONMENT ENTRY ANCHOR LINK
// Points directly to the InstructorDashboardComponent since it acts as your active operational core shell component
import { InstructorDashboardComponent } from './app/features/instructor-dashboard/instructor-dashboard.component';

bootstrapApplication(InstructorDashboardComponent, appConfig)
  .catch((err) => console.error('Application boot failure tracker intercepted:', err));
