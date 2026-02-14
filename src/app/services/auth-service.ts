import { inject, Injectable } from '@angular/core';
import { ILoginUser } from '../interfaces/auth/i-login-user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ITokenResponse } from '../interfaces/auth/i-token-response';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private endpoint: string = `${environment.apiUrl}/auth`;

  async login(loginUser: ILoginUser): Promise<void> {
    await lastValueFrom(
      this.httpClient.post<void>(`${this.endpoint}/login`, loginUser, {
        withCredentials: true,
      }),
    );
    this.router.navigate(['/dashboard']);
  }

  async logout(): Promise<void> {
    await lastValueFrom(
      this.httpClient.post<void>(`${this.endpoint}/logout`, {}, { withCredentials: true }),
    );
    this.router.navigate(['/']);
  }
}
