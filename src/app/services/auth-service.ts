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

  private accessToken: string | null = null;

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async login(loginUser: ILoginUser): Promise<void> {
    const result: ITokenResponse = await lastValueFrom(
      this.httpClient.post<ITokenResponse>(`${this.endpoint}/login`, loginUser),
    );
    this.setAccessToken(result.access_token);
    this.router.navigate(['/dashboard']);
  }

  async logout(): Promise<void> {
    this.setAccessToken(null);
    await this.httpClient.post<void>(`${this.endpoint}/logout`, {});
    this.router.navigate(['/']);
  }

  async isAccessTokenValid(): Promise<boolean> {
    try {
      await lastValueFrom(
        this.httpClient.post<void>(`${this.endpoint}/validate`, {
          acess_token: this.accessToken,
        }),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async refresh(): Promise<void> {
    try {
      const result: ITokenResponse = await lastValueFrom(
        this.httpClient.post<ITokenResponse>(`${this.endpoint}/refresh`, {}),
      );
      this.setAccessToken(result.access_token);
    } catch (errorResponse: any) {
      console.log(errorResponse.error);
      this.logout();
    }
  }
}
