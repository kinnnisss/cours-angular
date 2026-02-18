import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import type { PatientRequest, PatientModel ,PatientApi} from '@core/model/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly API = 'http://localhost:3001';
  private readonly patientsSubject = new BehaviorSubject<PatientModel[]>([]);
  readonly patients$ = this.patientsSubject.asObservable();
  constructor(private readonly http: HttpClient) {}
  refreshAll(): Observable<PatientModel[]> {
    return this.http.get<PatientModel[]>(`${this.API}/patients`).pipe(
      tap(list => this.patientsSubject.next(list)),
      catchError(() => {
        this.patientsSubject.next([]);
        return of([]);
      })
    );
  }

  getAll(): Observable<PatientModel[]> {
    return this.patients$;
  }
  getById(id: number): Observable<PatientModel | null> {
    return this.http.get<PatientModel>(`${this.API}/patients/${id}`).pipe(
      catchError(() =>
        this.patients$.pipe(
          map(list => list.find(p => p.id === id) ?? null)
        )
      )
    );
  }
  createPatient(patientData: PatientRequest): Observable<PatientModel> {
    if (!patientData.nom?.trim() || !patientData.prenom?.trim()) {
      return throwError(() => new Error('Données patient invalides'));
    }

    const payload = {
      ...patientData,
      nom: patientData.nom.trim(),
      prenom: patientData.prenom.trim(),
    };

    return this.http.post<PatientModel>(`${this.API}/patients`, payload).pipe(
      tap(created => {
        const current = this.patientsSubject.value;
        this.patientsSubject.next([created, ...current]);
      }),
      catchError((err) => {
        const msg = err?.message || 'Impossible de créer le patient';
        return throwError(() => new Error(msg));
      })
    );
  }
getByUserId(userId: string): Observable<PatientApi | null> {
  return this.http
    .get<PatientApi[]>(`${this.API}/patients`, { params: { userId } })
    .pipe(
      map((list) => list[0] ?? null),
      catchError(() => of(null))
    );
}



}
