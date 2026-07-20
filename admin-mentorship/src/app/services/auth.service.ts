import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, finalize } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  regionId: string | null;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.login;
  private profileUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.profile;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public get currentUserValue(): User | null { return this.currentUserSubject.value; }
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private http = inject(HttpClient);

  constructor() {
    this.restoreSessionFromToken();
  }

  /**
   * Отримати токен з localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('admin_access_token');
  }

  /**
   * Відновити сесію з токена при завантаженні сторінки
   */
  private restoreSessionFromToken() {
    const token = this.getToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decodedData = JSON.parse(decodedJson);

        const isExpired = (decodedData.exp * 1000) < Date.now();
        if (isExpired) {
          this.logout();
          return;
        }

        if (!this.currentUserSubject.value) {
          this.currentUserSubject.next({
            id: decodedData.sub,
            email: decodedData.email,
            role: decodedData.role,
            regionId: decodedData.regionId ?? null,
            name: decodedData.name || 'Користувач',
          });
        }
      } catch (e) {
        console.error('Помилка розшифровки токена:', e);
        this.logout();
      }
    }
  }

  /**
   * Авторизація
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    this.isLoadingSubject.next(true);
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((res) => {
        localStorage.setItem('admin_access_token', res.access_token);
        this.currentUserSubject.next(res.user);
      }),
      finalize(() => this.isLoadingSubject.next(false)),
      catchError(this.handleError),
    );
  }

  /**
   * Отримати профіль користувача
   */
  getProfile(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token'));
    }

    return this.http.get<User>(this.profileUrl).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      }),
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
        return throwError(() => err);
      }),
    );
  }

  /**
   * Вийти з системи
   */
  logout() {
    localStorage.removeItem('admin_access_token');
    this.currentUserSubject.next(null);
  }

  /**
   * Перевірити, чи користувач є суперадміністратором
   */
  isAdmin(): boolean {
    return this.currentUserValue?.role === 'SUPER_ADMIN';
  }

  /**
   * Перевірити, чи користувач має потрібну роль
   */
  hasRole(requiredRole: string): boolean {
    return this.currentUserValue?.role === requiredRole;
  }

  /**
   * Обробка помилок
   */
  private handleError(error: HttpErrorResponse) {
    let message = 'Невідома помилка';
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'Не вдалося підключитися до сервера';
    } else {
      message = `Помилка: ${error.status}`;
    }
    return throwError(() => new Error(message));
  }
}
