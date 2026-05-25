import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import type { RendezVous } from '../model/rendezvous.model';
import type { RvStatus } from '../model/rv-status.type';
import type { ApiResponse } from '@core/model/api-response.model';
import { API_BASE_URL } from '@core/config/api.config';

@Injectable({ providedIn: 'root' })
export class MesRvService {
  private readonly API = `${API_BASE_URL}/rdvs`;

  constructor(private readonly http: HttpClient) {}

  refreshAll(): Observable<RendezVous[]> {
    return this.http.get<ApiResponse<RendezVous[]>>(this.API).pipe(
      map(response => response.data)
    );
  }

  refreshByPatientId(patientId: string): Observable<RendezVous[]> {
    return this.http.get<ApiResponse<RendezVous[]>>(this.API, { params: { patientId } }).pipe(
      map(response => response.data)
    );
  }

  getById(id: string): Observable<RendezVous> {
    return this.http.get<ApiResponse<RendezVous>>(`${this.API}/${id}`).pipe(
      map(response => response.data)
    );
  }

  cancel(id: string): Observable<RendezVous> {
    return this.updateStatus(id, 'annule');
  }

  updateStatus(id: string, status: RvStatus): Observable<RendezVous> {
    return this.http.patch<ApiResponse<RendezVous>>(`${this.API}/${id}`, { status }).pipe(
      map(response => response.data)
    );
  }

  create(rv: Omit<RendezVous, 'id'>): Observable<RendezVous> {
    return this.http.post<ApiResponse<RendezVous>>(this.API, rv).pipe(
      map(response => response.data)
    );
  }
}
