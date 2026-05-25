import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';

import type { PatientRequest, PatientApi } from '@core/model/patient.model';
import type { ApiResponse, PageResponse } from '@core/model/api-response.model';
import { API_BASE_URL } from '@core/config/api.config';

export interface PatientPageQuery {
  userId?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: 'numero' | 'nom' | 'prenom' | 'tel';
  sortDir?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly API = `${API_BASE_URL}/patients`;

  constructor(private readonly http: HttpClient) {}

  getPage(query: PatientPageQuery = {}): Observable<PageResponse<PatientApi>> {
    const params: Record<string, string | number> = {
      page: query.page ?? 0,
      size: query.size ?? 5,
      sortBy: query.sortBy ?? 'nom',
      sortDir: query.sortDir ?? 'asc',
    };

    if (query.search?.trim()) params['search'] = query.search.trim();
    if (query.userId?.trim()) params['userId'] = query.userId.trim();

    return this.http.get<ApiResponse<PageResponse<PatientApi>>>(this.API, { params }).pipe(
      map(response => response.data)
    );
  }

  getById(id: number): Observable<PatientApi> {
    return this.http.get<ApiResponse<PatientApi>>(`${this.API}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createPatient(patientData: PatientRequest): Observable<PatientApi> {
    if (!patientData.nom?.trim() || !patientData.prenom?.trim()) {
      return throwError(() => new Error('Donnees patient invalides'));
    }

    const payload = {
      ...patientData,
      nom: patientData.nom.trim(),
      prenom: patientData.prenom.trim(),
    };

    return this.http.post<ApiResponse<PatientApi>>(this.API, payload).pipe(
      map(response => response.data),
      catchError((error) => {
        const message = error?.error?.errors?.[0] ?? 'Impossible de creer le patient';
        return throwError(() => new Error(message));
      })
    );
  }

  getByUserId(userId: string): Observable<PatientApi | null> {
    return this.getPage({ userId, page: 0, size: 1 }).pipe(
      map(page => page.items[0] ?? null)
    );
  }
}
