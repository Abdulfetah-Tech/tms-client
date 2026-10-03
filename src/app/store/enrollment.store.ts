import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, switchMap, EMPTY } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';
import { LiveSyncService } from '../services/live-sync.service'; // ✅ INJECTED SOCKET HOOK
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({ isLoading: false, error: null as string | null }),
  withEntities<Enrollment>(),
  withComputed((store) => ({
  pendingCount: computed(
    () => store.entities().filter(e => e.status === 'Pending').length
  ),

  approvedCount: computed(
    () => store.entities().filter(e => e.status === 'Approved').length
  ),

  rejectedCount: computed(
    () => store.entities().filter(e => e.status === 'Rejected').length
  ),
})),
  withMethods((
    store,
    api = inject(EnrollmentService),
    sync = inject(LiveSyncService) // ✅ INJECTED DRIVER PIPELINE
  ) => ({
    
    // ✅ REAL-TIME EVENT BRIDGE: Intercepts WebSocket streams and triggers state changes instantly
    listenForLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap(event => {
          patchState(
            store,
            updateEntity({ id: event.id, changes: { status: event.status } })
          );
        })
      )
    ),

    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() =>
          api.getAll().pipe(
            tap(rows => patchState(store, setAllEntities(rows), { isLoading: false })),
            catchError(err => {
              patchState(store, { isLoading: false, error: err.message });
              return EMPTY;
            })
          )
        )
      )
    ),

    approveEnrollment: rxMethod<string>(
      pipe(
        tap(id => {
          patchState(store, updateEntity({ id, changes: { status: 'Approved' } }));
        }),
        concatMap(id =>
          api.approve(id).pipe(
            catchError(err => {
              patchState(store, updateEntity({ id, changes: { status: 'Pending' } }));
              patchState(store, { error: 'Server validation exception caught.' });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);
