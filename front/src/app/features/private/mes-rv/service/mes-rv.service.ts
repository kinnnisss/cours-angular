import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import type { RendezVous } from '../model/rendezvous.model';
import type { RvStatus } from '../model/rv-status.type';

import { RDVS_MOCK } from '@mock';

@Injectable({ providedIn: 'root' })
export class MesRvService {
  private readonly rdvsSubject = new BehaviorSubject<RendezVous[]>(
    [...(RDVS_MOCK as unknown as RendezVous[])]
  );

  readonly rdvs$ = this.rdvsSubject.asObservable();

  getAll(): Observable<RendezVous[]> {
    return this.rdvs$.pipe(
      delay(200),
      map(list => [...list])
    );
  }

  cancel(id: string): Observable<boolean> {
    const list = this.rdvsSubject.value;
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return of(false).pipe(delay(150));

    const rv = list[idx];
    if (rv.status === 'annule' || rv.status === 'realise') {
      return of(false).pipe(delay(150));
    }

    const updated = [...list];
    updated[idx] = { ...rv, status: 'annule' };

    this.rdvsSubject.next(updated);

    return of(true).pipe(delay(150));
  }

  updateStatus(id: string, status: RvStatus): Observable<boolean> {
    const list = this.rdvsSubject.value;
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return of(false).pipe(delay(150));

    const updated = [...list];
    updated[idx] = { ...updated[idx], status };

    this.rdvsSubject.next(updated);

    return of(true).pipe(delay(150));
  }

  getById(id: string): Observable<RendezVous | null> {
    return this.rdvs$.pipe(
      map(list => list.find(r => r.id === id) ?? null)
    );
  }
}
