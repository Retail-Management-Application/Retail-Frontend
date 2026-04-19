import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  // Temporarily disabled for testing
  // intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   const token = localStorage.getItem('token');

  //   const cloned = token
  //     ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  //     : req;

  //   return next.handle(cloned).pipe(
  //     catchError((err: HttpErrorResponse) => {
  //       if (err.status === 401) {
  //         localStorage.clear();
  //         this.router.navigate(['/auth/login']);
  //       }
  //       return throwError(() => err);
  //     })
  //   );
  // }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add a mock token to bypass backend auth for testing
    const mockToken = 'mock-test-token-' + Date.now();
    const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${mockToken}` } });
    return next.handle(cloned);
  }
}

