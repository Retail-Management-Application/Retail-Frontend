import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError, from } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserProfile,
} from 'src/app/core/models/user.model';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { UserListItem } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userApiUrl = `${environment.apiUrl}/users`;

  private authSubject = new BehaviorSubject<AuthResponse | null>(this.loadToken());
  public auth$ = this.authSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ─── Auth Methods ───

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        if (res.success) {
          this.saveToken(res.data);
          this.authSubject.next(res.data);
        }
      })
    );
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        if (res.success) {
          this.saveToken(res.data);
          this.authSubject.next(res.data);
        }
      })
    );
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap((res) => {
          if (res.success) {
            this.saveToken(res.data);
            this.authSubject.next(res.data);
          }
        })
      );
  }

  logout(): Observable<ApiResponse<null>> {
    const current = this.authSubject.value;
    return this.http
      .post<ApiResponse<null>>(`${this.apiUrl}/logout`, {
        refreshToken: current?.refreshToken,
      })
      .pipe(
        tap({
          complete: () => {
            this.clearToken();
            this.authSubject.next(null);
          },
        })
      );
  }

  // ─── User Profile Methods ───

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.userApiUrl}/profile`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.userApiUrl}/profile`, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.userApiUrl}/change-password`, data);
  }

  getAllUsers(): Observable<ApiResponse<UserListItem[]>> {
    return this.http.get<ApiResponse<UserListItem[]>>(`${this.userApiUrl}`);
  }

  getUserById(id: number): Observable<ApiResponse<UserListItem>> {
    return this.http.get<ApiResponse<UserListItem>>(`${this.userApiUrl}/${id}`);
  }

  // ─── Helpers ───

  get currentUser(): AuthResponse | null {
    return this.authSubject.value;
  }

  get token(): string | null {
    return this.authSubject.value?.token ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.authSubject.value && !this.isTokenExpired;
  }

  get isAdmin(): boolean {
    return this.authSubject.value?.role === 'Admin';
  }

  get isCustomer(): boolean {
    return this.authSubject.value?.role === 'Customer';
  }

  get isTokenExpired(): boolean {
    const expiry = this.authSubject.value?.tokenExpiry;
    if (!expiry) return true;
    return new Date(expiry) <= new Date();
  }

  private saveToken(auth: AuthResponse): void {
    localStorage.setItem('auth_data', JSON.stringify(auth));
  }

  private loadToken(): AuthResponse | null {
    try {
      const stored = localStorage.getItem('auth_data');
      if (!stored) return null;
      const auth = JSON.parse(stored) as AuthResponse;
      if (new Date(auth.tokenExpiry) <= new Date()) {
        localStorage.removeItem('auth_data');
        return null;
      }
      return auth;
    } catch {
      localStorage.removeItem('auth_data');
      return null;
    }
  }

  private clearToken(): void {
    localStorage.removeItem('auth_data');
  }
}