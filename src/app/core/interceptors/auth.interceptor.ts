import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, from, switchMap, catchError, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Don't attach token to auth endpoints
    if (req.url.includes('/api/auth/') && !req.url.includes('/api/auth/logout')) {
      return next.handle(req);
    }

    const token = this.authService.token;
    if (!token) {
      return next.handle(req);
    }

    let authReq = this.addToken(req, token);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/api/auth/refresh-token')) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);

      const refreshToken = this.authService.currentUser?.refreshToken;
      if (!refreshToken) {
        this.authService.logout().subscribe();
        return throwError(() => new Error('Session expired. Please login again.'));
      }

      return from(this.authService.refreshToken(refreshToken).toPromise()).pipe(
        switchMap((res:any) => {
          this.isRefreshing = false;
          this.refreshSubject.next(res.data.token);
          return next.handle(this.addToken(req, res.data.token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout().subscribe();
          return throwError(() => new Error('Session expired. Please login again.'));
        })
      );
    }

    return this.refreshSubject.pipe(
      switchMap((token) => {
        if (token) return next.handle(this.addToken(req, token));
        return throwError(() => new Error('Session expired. Please login again.'));
      })
    );
  }
}