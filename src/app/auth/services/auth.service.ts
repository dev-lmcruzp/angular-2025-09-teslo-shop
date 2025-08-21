import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'
const _KEY_TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private envs = environment;
  private _authStatus: WritableSignal<AuthStatus> = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem(_KEY_TOKEN));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus()
  })

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  checkRoles(roles: string[]): boolean {
    const user = this.user();
    if (!user) return false;
    return user.roles.some((role: string) => roles.includes(role));
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.envs.baseUrl}/auth/login`,
      {
        email: email,
        password: password
      }
    )
      .pipe(
        map((resp) => this.handleAuthSuccuss(resp)),
        catchError((error: any) => this.handleAuthError(error))
      )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem(_KEY_TOKEN);
    if (!token) {
      this.logout();
      return of(false);
    };

    return this.http.get<AuthResponse>(`${this.envs.baseUrl}/auth/check-status`,
      {
        // Se cambia aun interceptor
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }
    )
      .pipe(
        map((resp) => this.handleAuthSuccuss(resp)),
        catchError((error: any) => this.handleAuthError(error))
      )
  }

  register(fullName: string, email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.envs.baseUrl}/auth/register`,
      {
        fullName: fullName,
        email: email,
        password: password
      }
    )
      .pipe(
        map((resp) => this.handleAuthSuccuss(resp)),
        catchError((error: any) => this.handleAuthError(error))
      )
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem(_KEY_TOKEN);
  }

  private handleAuthSuccuss({ token, user }: AuthResponse): boolean {
    this._authStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem(_KEY_TOKEN, token);
    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout();
    return of(false);
  }
}
