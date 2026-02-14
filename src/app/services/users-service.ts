import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/users/i-user';
import { ISignupUser } from '../interfaces/users/i-signup-user';
import { IUpdateUser } from '../interfaces/users/i-update-user';
import { ITokenResponse } from '../interfaces/auth/i-token-response';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  private endpoint: string = `${environment.apiUrl}/users`;

  private user: WritableSignal<IUser | null> = signal(null);

  async getMyUser(): Promise<IUser | null> {
    try {
      this.user.set(
        await lastValueFrom(
          this.httpClient.get<IUser>(`${this.endpoint}/me`, { withCredentials: true }),
        ),
      );
    } catch (error) {
      this.user.set(null);
    } finally {
      return this.getUser();
    }
  }

  getUser(): IUser | null {
    const user: IUser | null = this.user();
    if (!user) return null;
    return { ...user };
  }

  async signup(signupUser: ISignupUser): Promise<void> {
    await lastValueFrom(
      this.httpClient.post<void>(`${this.endpoint}/signup`, signupUser, {
        withCredentials: true,
      }),
    );
    this.router.navigate(['/dashboard']);
  }

  async update(updateUser: IUpdateUser): Promise<void> {
    await lastValueFrom(
      this.httpClient.put<void>(this.endpoint, updateUser, { withCredentials: true }),
    );
    this.getMyUser();
  }

  async delete(): Promise<void> {
    await lastValueFrom(this.httpClient.delete<void>(this.endpoint));
    this.authService.logout();
  }
}
