import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import type { UserRequest, UserResponse, User } from '@core/model/user.model';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private readonly API = 'http://localhost:3001';

  constructor(private readonly http: HttpClient) {}
  login(payload: UserRequest): Observable<UserResponse> {
    const email = payload.email?.trim().toLowerCase() ?? '';
    const password = payload.password ?? '';

    if (!email || !password) {
      return throwError(() => new Error('Email ou mot de passe requis'));
    }

    return this.http
      .get<User[]>(`${this.API}/users`, { params: { email } })
      .pipe(
        map((users) => {
          const u = users.find(x => x.email.toLowerCase() === email);

          if (!u || u.password !== password) {
            throw new Error('Email ou mot de passe incorrect');
          }

          const response: UserResponse = {
            token: 'fake-jwt-token',
            user: u,
          };

          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          return response;
        }),
        catchError((err) => {
          const msg = err?.message || 'Erreur de connexion au serveur';
          return throwError(() => new Error(msg));
        })
      );
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
