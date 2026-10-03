import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnrollmentStore } from './store/enrollment.store';
import { AuthService } from './services/auth.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: []
})
export class AppComponent implements OnInit {
  private store = inject(EnrollmentStore);
  // Expose auth to the root template layer if needed for conditional global frames
  public auth = inject(AuthService);

  ngOnInit() {
    // 1. RUNTIME INITIALIZATION MATRIX: Fires store loaders and persistent communication sockets
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();

    // 2. RUNTIME AUTH STATE RECOVERY: Ensures a browser refresh doesn't break active memory profiles
    // If you add a profiling fallback later (like checking localStorage/sessionStorage), call it here:
    // this.auth.restoreSessionIfAvailable();
  }
}
