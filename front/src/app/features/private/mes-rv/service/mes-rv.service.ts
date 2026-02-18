import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import type { RendezVous } from '../model/rendezvous.model';
import type { RvStatus } from '../model/rv-status.type';

@Injectable({ providedIn: 'root' })
export class MesRvService {
  private readonly API = 'http://localhost:3001';

  private readonly rdvsSubject = new BehaviorSubject<RendezVous[]>([]);
  readonly rdvs$ = this.rdvsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}
  refreshAll(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.API}/rdvs`).pipe(
      tap(list => this.rdvsSubject.next(list)),
      catchError(() => {
        this.rdvsSubject.next([]);
        return of([]);
      })
    );
  }

  refreshByPatientId(patientId: string): Observable<RendezVous[]> {
    return this.http
      .get<RendezVous[]>(`${this.API}/rdvs`, { params: { patientId } })
      .pipe(
        tap(list => this.rdvsSubject.next(list)),
        catchError(() => {
          this.rdvsSubject.next([]);
          return of([]);
        })
      );
  }

  getAll(): Observable<RendezVous[]> {
    return this.rdvs$;
  }

  getById(id: string): Observable<RendezVous | null> {
    return this.http.get<RendezVous>(`${this.API}/rdvs/${id}`).pipe(
      catchError(() =>
        this.rdvs$.pipe(
          map(list => list.find(r => r.id === id) ?? null)
        )
      )
    );
  }
  cancel(id: string): Observable<boolean> {
    const current = this.rdvsSubject.value;
    const rv = current.find(r => r.id === id);
    if (!rv) return of(false);

    if (rv.status === 'annule' || rv.status === 'realise') {
      return of(false);
    }

    return this.http.patch<RendezVous>(`${this.API}/rdvs/${id}`, { status: 'annule' as RvStatus }).pipe(
      tap(updatedRv => {
        const list = this.rdvsSubject.value;
        const idx = list.findIndex(r => r.id === id);
        if (idx === -1) return;

        const updated = [...list];
        updated[idx] = { ...updated[idx], status: updatedRv.status };
        this.rdvsSubject.next(updated);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }
  updateStatus(id: string, status: RvStatus): Observable<boolean> {
    return this.http.patch<RendezVous>(`${this.API}/rdvs/${id}`, { status }).pipe(
      tap(updatedRv => {
        const list = this.rdvsSubject.value;
        const idx = list.findIndex(r => r.id === id);
        if (idx === -1) return;

        const updated = [...list];
        updated[idx] = { ...updated[idx], status: updatedRv.status };
        this.rdvsSubject.next(updated);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }
  create(rv: Omit<RendezVous, 'id'>): Observable<RendezVous> {
    return this.http.get<RendezVous[]>(`${this.API}/rdvs`).pipe(
      map(list => this.nextId(list)),
      switchMap(newId => {
        const newRv: RendezVous = { id: newId, ...rv };
        return this.http.post<RendezVous>(`${this.API}/rdvs`, newRv).pipe(
          tap(created => {
            const current = this.rdvsSubject.value;
            this.rdvsSubject.next([created, ...current]);
          })
        );
      })
    );
  }

  private nextId(list: RendezVous[]): string {
    const nums = list
      .map(r => Number(String(r.id).replace('RV-', '')))
      .filter(n => !Number.isNaN(n));

    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `RV-${String(next).padStart(4, '0')}`;
  }
}
