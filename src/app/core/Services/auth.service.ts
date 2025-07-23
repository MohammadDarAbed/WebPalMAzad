import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';

export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5001/api/auth';
  private isLoggedInSubject$: BehaviorSubject<boolean>;
  readonly isLoggedIn$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.isLoggedInSubject$ = new BehaviorSubject<boolean>(this.isAuthenticated());
    this.isLoggedIn$ = this.isLoggedInSubject$.asObservable();
  }

  login(credentials: { userNameOrEmail: string; password: string }) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        this.isLoggedInSubject$.next(true);
        this.router.navigate(['/home']);
      })
    );
  }

  logout() {
    const refreshToken = this.tokenService.refreshToken;
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    }
    this.tokenService.clear();
    this.isLoggedInSubject$.next(false);
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    const refreshToken = this.tokenService.refreshToken;
    if (!refreshToken) {
      // Optionally handle no refresh token scenario
      return throwError(() => new Error('No refresh token'));
    }
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/refresh-token`,
      { refreshToken }
    );
  }

  getAccessToken(): string | null {
    return this.tokenService.accessToken;
  }

  getRefreshToken(): string | null {
    return this.tokenService.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
