/**
 * AuthInterceptor
 * ----------------
 * This HTTP interceptor is responsible for:
 * 1. Attaching the access token to outgoing HTTP requests via the `Authorization` header.
 * 2. Intercepting 401 Unauthorized responses and attempting to refresh the token using the refresh token.
 * 3. Retrying the original request after successful token refresh.
 * 4. Clearing tokens and redirecting to login if refresh fails.

 * Benefits:
 * - Centralizes authentication logic for API requests.
 * - Reduces repetitive code across services.
 * - Ensures smoother user experience by handling silent token refresh.

 * Usage:
 * - Register this class in the `HTTP_INTERCEPTORS` array in your AppModule.
 * 
 * Example:
 * providers: [
 *   {
 *     provide: HTTP_INTERCEPTORS,
 *     useClass: AuthInterceptor,
 *     multi: true,
 *   }
 * ];
 */

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';
import { TokenService } from '../Services/token.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.accessToken;
    let authReq = req;

    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              // Use response.accessToken and response.refreshToken (match backend response)
              this.tokenService.setTokens(response.accessToken, response.refreshToken);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });
              this.isRefreshing = false;
              return next.handle(newReq);
            }),
            catchError(refreshError => {
              this.tokenService.clear();
              this.isRefreshing = false;
              this.authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
