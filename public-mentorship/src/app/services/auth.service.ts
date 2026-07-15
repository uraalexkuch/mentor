import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}${environment.api.auth}`;
  public currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  checkToken() {
    const token = this.getToken();
    if (token) {
      this.http.get(`${this.apiUrl}/me`).subscribe({
        next: (user) => this.currentUser.set(user),
        error: () => this.logout()
      });
    }
  }

  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.currentUser.set(res.user);
      })
    );
  }

  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.currentUser.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUser.set(null);
  }
}
