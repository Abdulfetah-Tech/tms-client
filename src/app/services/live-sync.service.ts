import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// ✅ FRAMEWORK INVARIANT FIX: Replaced custom shorthand macro with Angular's stable decorator asset
@Injectable({ providedIn: 'root' })
export class LiveSyncService {
  private platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
  private eventsSubject = new Subject<EnrollmentStatusEvent>();
  
  // Expose events as an observable stream for store binding configurations
  events$ = this.eventsSubject.asObservable();
  
  // Connection state signal to monitor real-time WebSocket health on layout screens
  connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

  connect() {
    // Guard against duplicate active hub connection contexts
    if (this.connection) return;

    // Skip handshakes if compiling inside non-browser server-side SSR execution states
    if (!isPlatformBrowser(this.platformId)) return;

    // Build the persistent real-time socket connection map
    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/tms')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    // ✅ WEBSOCKET CAPTURE MATRIX: Listens for backend strongly-typed status broadcasts
    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (enrollmentId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
        this.eventsSubject.next({ id: enrollmentId, status });
      }
    );

    // Stream transport lifecycle changes straight into reactive signals
    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
    this.connection.onreconnected(() => this.connectionState.set('connected'));
    this.connection.onclose(() => this.connectionState.set('disconnected'));

    // Start the socket connection channel stream loop
    this.connection
      .start()
      .then(() => this.connectionState.set('connected'))
      .catch(err => console.error('SignalR connection error reference:', err));
  }
}
