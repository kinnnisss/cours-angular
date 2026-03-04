import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import type { PatientApi } from '@core/model/patient.model';
import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { RendezVousApi} from '@features/private/mes-rv/model/rendezvous.model';

export interface DossierMedical {
  patient: PatientApi;
  demandes: DemandeRv[];
  rdvs: RendezVousApi[];
}

@Injectable({ providedIn: 'root' })
export class DossierMedicalService {
  private readonly API = 'http://localhost:3001';

  private readonly patientSubject = new BehaviorSubject<PatientApi | null>(null);
  readonly patient$ = this.patientSubject.asObservable();

  private readonly demandesSubject = new BehaviorSubject<DemandeRv[]>([]);
  readonly demandes$ = this.demandesSubject.asObservable();

  private readonly rdvsSubject = new BehaviorSubject<RendezVousApi[]>([]);
  readonly rdvs$ = this.rdvsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}
  refreshPatientByUserId(userId: string): Observable<PatientApi | null> {
    return this.http.get<PatientApi[]>(`${this.API}/patients`, { params: { userId } }).pipe(
      map(list => list?.[0] ?? null),
      tap(patient => this.patientSubject.next(patient)),
      catchError(() => {
        this.patientSubject.next(null);
        return of(null);
      })
    );
  }

  getPatientByUserId(userId: string): Observable<PatientApi | null> {
    const cached = this.patientSubject.value;
    if (cached?.userId === userId) return this.patient$;
    return this.refreshPatientByUserId(userId).pipe(switchMap(() => this.patient$));
  }
  refreshDemandesByPatientId(patientId: number): Observable<DemandeRv[]> {
    return this.http.get<DemandeRv[]>(`${this.API}/demandes`, { params: { patientId } as any }).pipe(
      tap(list => this.demandesSubject.next(list ?? [])),
      catchError(() => {
        this.demandesSubject.next([]);
        return of([]);
      })
    );
  }

  getDemandesByPatientId(patientId: number): Observable<DemandeRv[]> {
    if (this.demandesSubject.value.length > 0) return this.demandes$;
    return this.refreshDemandesByPatientId(patientId).pipe(switchMap(() => this.demandes$));
  }
  refreshRdvsByPatientId(patientId: number): Observable<RendezVousApi[]> {
    return this.http.get<RendezVousApi[]>(`${this.API}/rdvs`, { params: { patientId } as any }).pipe(
      map(list => (list ?? []).slice().sort((a, b) => b.dateIso.localeCompare(a.dateIso))),
      tap(list => this.rdvsSubject.next(list)),
      catchError(() => {
        this.rdvsSubject.next([]);
        return of([]);
      })
    );
  }

  getRdvsByPatientId(patientId: number): Observable<RendezVousApi[]> {
    if (this.rdvsSubject.value.length > 0) return this.rdvs$;
    return this.refreshRdvsByPatientId(patientId).pipe(switchMap(() => this.rdvs$));
  }
  loadDossierByUserId(userId: string): Observable<DossierMedical | null> {
    return this.refreshPatientByUserId(userId).pipe(
      switchMap(patient => {
        if (!patient?.id) return of(null);

        return combineLatest([
          this.refreshDemandesByPatientId(patient.id),
          this.refreshRdvsByPatientId(patient.id),
        ]).pipe(
          map(([demandes, rdvs]) => ({
            patient,
            demandes,
            rdvs,
          }))
        );
      }),
      shareReplay(1),
      catchError(() => of(null))
    );
  }

  clear(): void {
    this.patientSubject.next(null);
    this.demandesSubject.next([]);
    this.rdvsSubject.next([]);
  }
}