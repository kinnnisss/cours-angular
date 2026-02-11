import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import type { PatientRequest,PatientModel } from '@core/model/patient.model';
import { PATIENT_MOCKS } from '@mock';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly patientsSubject = new BehaviorSubject<PatientModel[]>(
    [...(PATIENT_MOCKS as unknown as PatientModel[])]
  );

  readonly patients$ = this.patientsSubject.asObservable();

  getAll(): Observable<PatientModel[]> {
    return this.patients$.pipe(
      delay(150),
      map(list => [...list])
    );
  }

  getById(id: number): Observable<PatientModel | null> {
    return this.patients$.pipe(
      map(list => list.find(p => p.id === id) ?? null)
    );
  }

  createPatient(patientData: PatientRequest): Observable<PatientModel> {
    if (!patientData.nom?.trim() || !patientData.prenom?.trim()) {
      return throwError(() => new Error('Données patient invalides'));
    }

    const list = this.patientsSubject.value;

    const newPatient: PatientModel = {
      id: this.generateId(list),
      ...patientData
    };
    this.patientsSubject.next([newPatient, ...list]);

    return of(newPatient).pipe(delay(300));
  }

  private generateId(list: PatientModel[]): number {
    const ids = list.map(p => p.id).filter(n => typeof n === 'number' && !Number.isNaN(n));
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }
}
