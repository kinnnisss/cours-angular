import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UserRequest, UserResponse } from '@core/model/user.model';
import { USERS_MOCK } from '@mock';

@Injectable({ providedIn: 'root' })
export class SecurityService {

  login(payload: UserRequest): Observable<UserResponse> {
    return of(USERS_MOCK).pipe(
      delay(500),
      map((users) => {
        const u = users.find(
          (x) => x.email === payload.email && x.password === payload.password
        );

        if (!u) {
          throw new Error('Email ou mot de passe incorrect');
        }

        const response: UserResponse = {
          token: 'fake-jwt-token',
          user: u,
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
