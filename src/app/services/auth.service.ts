import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TmsUser {
  email: string;
  displayName: string;
  role: string;
}

export interface LoginRequest {
  email: string;     
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseAuthUrl = `${environment.apiUrl}/auth`;

  // Exercise 6: Reactive in-memory state signals to track authentication values safely
  private accessToken = signal<string | null>(null);
  currentUser = signal<TmsUser | null>(null);

  // Exercise 6: Expose the raw token value cleanly for the HTTP Interceptor pipeline
  getAccessToken(): string | null {
    return this.accessToken();
  }

  // Check structural role capabilities reactively (Admins bypass route constraints automatically)
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginRequest): Promise<void> {
    // 1. Submit credentials to the .NET API endpoint to obtain structural bearer tokens
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseAuthUrl}/login`, credentials)
    );

    // 2. Commit the temporary short-lived token to reactive browser memory storage
    this.accessToken.set(res.accessToken);

    // 3. Unpack and transform the JWT token payload securely using standard base64 decoding
    try {
      const tokenParts = res.accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        
        this.currentUser.set({
          email: payload.email || payload.sub || '',
          displayName: payload.name || payload.email || 'User',
          role: payload['http://microsoft.com'] 
                || payload.role 
                || 'Student'
        });
      }
    } catch (error) {
      console.error('Failed to parse JWT payload tokens gracefully:', error);
      this.logout();
    }
  }

  // Clear in-memory token states cleanly to close down downstream operations
  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }
}
