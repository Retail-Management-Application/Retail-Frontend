// src/app/core/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    const user = this.authService.getCurrentUser();

    if (user && user.role === 'Admin') {
      return true;
    }

    if (!user) {
      return this.router.createUrlTree(['/auth/login']);
    }

    // Logged in but not Admin → back to products
    return this.router.createUrlTree(['/products']);
  }
}