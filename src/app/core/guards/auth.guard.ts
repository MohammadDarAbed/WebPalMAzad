/**
 * AuthGuard
 * ----------
 * This route guard protects authenticated routes in the application. for example if the user try to go to any url direct without login
 * It checks if a valid access token exists (i.e., user is logged in).
 * If not, it redirects the user to the login page.
 * 
 * Usage:
 * - Add `canActivate: [AuthGuard]` to any route that requires authentication.
 * - Works with both eager and lazy-loaded routes.
 * 
 * Note:
 * - Ensure the token check is accurate and updated in AuthService.
 * - Use with lazy-loaded modules by guarding the child routes as well.
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}

