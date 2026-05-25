import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';

import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import type { DemandeRvCreate } from '@features/private/demande-rv/model/demande-create.model';
import type { DemandeStatus } from '@features/private/demande-rv/model/demande-status.type';
import type { ApiResponse, PageResponse } from '@core/model/api-response.model';
import { API_BASE_URL } from '@core/config/api.config';

export interface DemandePageQuery {
  patientId?: number;
  date?: string;
  status?: DemandeStatus | '';
  specialite?: string;
  patientQuery?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class DemandeRvService {
  private readonly API = `${API_BASE_URL}/demandes`;

  constructor(private readonly http: HttpClient) {}

  getPage(query: DemandePageQuery = {}): Observable<PageResponse<DemandeRv>> {
    const params: Record<string, string | number> = {
      page: query.page ?? 0,
      size: query.size ?? 5,
    };

    if (query.patientId !== undefined) params['patientId'] = query.patientId;
    if (query.date?.trim()) params['date'] = query.date.trim();
    if (query.status?.trim()) params['status'] = query.status.trim();
    if (query.specialite?.trim()) params['specialite'] = query.specialite.trim();
    if (query.patientQuery?.trim()) params['patientQuery'] = query.patientQuery.trim();

    return this.http.get<ApiResponse<PageResponse<DemandeRv>>>(this.API, { params }).pipe(
      map(response => response.data)
    );
  }

  getById(id: string | number): Observable<DemandeRv> {
    return this.http.get<ApiResponse<DemandeRv>>(`${this.API}/${id}`).pipe(
      map(response => response.data)
    );
  }

  create(payload: DemandeRvCreate): Observable<DemandeRv> {
    return this.http.post<ApiResponse<DemandeRv>>(this.API, payload).pipe(
      map(response => response.data),
      catchError((error) => {
        const message = error?.error?.errors?.[0] ?? 'Impossible de creer la demande';
        return throwError(() => new Error(message));
      })
    );
  }

  updateStatus(id: number | string, status: DemandeStatus): Observable<DemandeRv> {
    return this.http.patch<ApiResponse<DemandeRv>>(`${this.API}/${id}`, { status }).pipe(
      map(response => response.data)
    );
  }
}
