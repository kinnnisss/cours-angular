import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import type { UserRequest, UserResponse, User } from '@core/model/user.model';
import type { ApiResponse } from '@core/model/api-response.model';
import { API_BASE_URL } from '@core/config/api.config';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private readonly API = `${API_BASE_URL}/auth`;

  constructor(private readonly http: HttpClient) {}

  login(payload: UserRequest): Observable<UserResponse> {
    const email = payload.email?.trim().toLowerCase() ?? '';
    const password = payload.password ?? '';

    if (!email || !password) {
      return throwError(() => new Error('Email ou mot de passe requis'));
    }

    return this.http.post<ApiResponse<UserResponse>>(`${this.API}/login`, { email, password }).pipe(
      map(response => response.data),
      catchError((error) => {
        const message = error?.error?.errors?.[0] ?? 'Email ou mot de passe incorrect';
        return throwError(() => new Error(message));
      })
    );
  }

  persistSession(response: UserResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? (JSON.parse(userStr) as User) : null;
  }
}
