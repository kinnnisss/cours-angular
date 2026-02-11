import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeRvCreate } from '@features/private/demande-rv/model/demande-create.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';

import { DEMANDES_MOCK } from '@mock';

@Injectable({ providedIn: 'root' })
export class DemandeRvService {
  private readonly demandesSubject = new BehaviorSubject<DemandeRv[]>(
    [...(DEMANDES_MOCK as unknown as DemandeRv[])]
  );

  readonly demandes$ = this.demandesSubject.asObservable();

  getAll(): Observable<DemandeRv[]> {
    return this.demandes$.pipe(
      delay(200),
      map(list => [...list])
    );
  }

  getById(id: string): Observable<DemandeRv | null> {
    return this.demandes$.pipe(
      map(list => list.find(d => d.id === id) ?? null)
    );
  }

  create(payload: DemandeRvCreate): Observable<DemandeRv> {
    const list = this.demandesSubject.value;

    const newDemande: DemandeRv = {
      id: this.nextId(list),
      patientId: payload.patientId,
      patientNom: payload.patientNom,
      specialite: payload.specialite,
      date: payload.date,
      heure: payload.heure,
      status: 'en_attente',
    };

    this.demandesSubject.next([newDemande, ...list]);

    return of(newDemande).pipe(delay(200));
  }

  updateStatus(id: string, status: DemandeStatus): Observable<boolean> {
    const list = this.demandesSubject.value;
    const idx = list.findIndex(x => x.id === id);

    if (idx === -1) return of(false).pipe(delay(150));

    const updated = [...list];
    updated[idx] = { ...updated[idx], status };

    this.demandesSubject.next(updated);

    return of(true).pipe(delay(150));
  }

  private nextId(list: DemandeRv[]): string {
    const nums = list
      .map(d => Number(d.id.replace('DEM-', '')))
      .filter(n => !Number.isNaN(n));

    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `DEM-${String(next).padStart(4, '0')}`;
  }
  getByPatientId(patientId: string) {
  return this.demandes$.pipe(
    map(list => list.filter(d => d.patientId === patientId))
  );
}

}
