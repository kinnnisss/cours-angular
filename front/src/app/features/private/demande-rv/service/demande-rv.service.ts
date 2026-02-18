import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeRvCreate } from '@features/private/demande-rv/model/demande-create.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';

@Injectable({ providedIn: 'root' })
export class DemandeRvService {
  private readonly API = 'http://localhost:3001';

  private readonly demandesSubject = new BehaviorSubject<DemandeRv[]>([]);
  readonly demandes$ = this.demandesSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  refreshAll(): Observable<DemandeRv[]> {
    return this.http.get<DemandeRv[]>(`${this.API}/demandes`).pipe(
      tap(list => this.demandesSubject.next(list)),
      catchError(() => {
        this.demandesSubject.next([]);
        return of([]);
      })
    );
  }

  getAll(): Observable<DemandeRv[]> {
    return this.demandes$;
  }
  getById(id: string): Observable<DemandeRv | null> {
    return this.http.get<DemandeRv>(`${this.API}/demandes/${id}`).pipe(
      catchError(() =>
        this.demandes$.pipe(
          map(list => list.find(d => d.id === id) ?? null)
        )
      )
    );
  }

  getByPatientId(patientId: number): Observable<DemandeRv[]> {
    return this.http
      .get<DemandeRv[]>(`${this.API}/demandes`, { params: { patientId } })
      .pipe(
        tap(list => this.demandesSubject.next(list)),
        catchError(() => {
          this.demandesSubject.next([]);
          return of([]);
        })
      );
  }
  create(payload: DemandeRvCreate): Observable<DemandeRv> {
    return this.http.get<DemandeRv[]>(`${this.API}/demandes`).pipe(
      map(list => this.nextId(list)),
      switchMap(newId => {
        const newDemande: DemandeRv = {
          id: newId,
          patientId: payload.patientId,
          patientNom: payload.patientNom,
          specialite: payload.specialite,
          date: payload.date,
          heure: payload.heure,
          status: 'en_attente',
        };

        return this.http.post<DemandeRv>(`${this.API}/demandes`, newDemande).pipe(
          tap(created => {
            const current = this.demandesSubject.value;
            this.demandesSubject.next([created, ...current]);
          })
        );
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  updateStatus(id: string, status: DemandeStatus): Observable<boolean> {
    return this.http.patch<DemandeRv>(`${this.API}/demandes/${id}`, { status }).pipe(
      tap(updatedDemande => {
        const list = this.demandesSubject.value;
        const idx = list.findIndex(d => d.id === id);
        if (idx === -1) return;

        const updated = [...list];
        updated[idx] = { ...updated[idx], status: updatedDemande.status };
        this.demandesSubject.next(updated);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }


  private nextId(list: DemandeRv[]): string {
    const nums = list
      .map(d => Number(String(d.id).replace('DEM-', '')))
      .filter(n => !Number.isNaN(n));

    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `DEM-${String(next).padStart(4, '0')}`;
  }
}
