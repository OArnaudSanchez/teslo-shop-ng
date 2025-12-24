import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AUTH_ENDPOINTS } from '@auth/endpoints/auth.endpoints';
import { AuthResponse } from '@auth/interfaces/auth-resonse.interface';
import { Login } from '@auth/interfaces/login.interface';
import { Register } from '@auth/interfaces/register.interface';
import { User } from '@auth/interfaces/user.interface';
import { AuthStatus } from '@auth/types/auth-status.type';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

const LOCAL_STORAGE_KEY = environment.LOCAL_STORAGE_KEY;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly baseUrl = environment.API_URL;

  private _authStatus = signal<AuthStatus>('CHECKING');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(this.localStorageService.getItem(LOCAL_STORAGE_KEY));

  readonly authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'CHECKING') return 'CHECKING';
    return this._user() ? 'AUTHENTICATED' : 'NOT-AUTHENTICATED';
  });
  readonly user = computed<User | null>(() => this._user());
  readonly token = computed<string | null>(() => this._token());

  checkStatusResource = rxResource({
    stream: () => this.checkAuthStatus(),
  });

  login(payload: Login): Observable<boolean> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/${AUTH_ENDPOINTS.login}`, payload).pipe(
      map((response) => this.handleAuthSuccess(response, 'AUTHENTICATED')),
      catchError((error) => this.handleAuthError(error))
    );
  }

  register(payload: Register): Observable<boolean> {
    return this.httpClient
      .post<AuthResponse>(`${this.baseUrl}/${AUTH_ENDPOINTS.register}`, payload)
      .pipe(
        map(response => this.handleAuthSuccess(response, 'AUTHENTICATED')),
        catchError(error => this.handleAuthError(error))
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = this.localStorageService.getItem(LOCAL_STORAGE_KEY);
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.httpClient.get<AuthResponse>(`${this.baseUrl}/${AUTH_ENDPOINTS.checkStatus}`).pipe(
      map((response) => this.handleAuthSuccess(response, 'AUTHENTICATED')),
      catchError((error) => this.handleAuthError(error))
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('NOT-AUTHENTICATED');

    this.localStorageService.removeItem(LOCAL_STORAGE_KEY);
  }

  private handleAuthSuccess(response: AuthResponse, status: AuthStatus): boolean {
    const { user, token } = response;

    this._user.set(user);
    this._token.set(token);
    this._authStatus.set(status);

    this.localStorageService.setItem(LOCAL_STORAGE_KEY, token);
    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout();
    console.log(error);
    return of(false);
  }
}
