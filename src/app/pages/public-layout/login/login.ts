import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { Form } from '../../../components/form/form';
import { IFormInput } from '../../../interfaces/form/i-form-input';
import { ILoginUser } from '../../../interfaces/auth/i-login-user';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [Form],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);

  loginUser: WritableSignal<ILoginUser | null> = signal(null);

  inputs: IFormInput[] = [
    {
      name: 'username',
      label: 'Usuario',
      value: '',
      validators: null,
    },
    {
      name: 'password',
      label: 'Contraseña',
      value: '',
      type: 'password',
      validators: null,
    },
  ];

  generalError: WritableSignal<string> = signal('');

  async login() {
    this.generalError.set('');
    const loginUser: ILoginUser | null = this.loginUser();

    if (!loginUser) {
      this.generalError.set('Credenciales incorrectas.');
      return;
    }
    try {
      await this.authService.login(loginUser);
    } catch (errorResponse: any) {
      this.generalError.set(
        errorResponse.message || 'Ha ocurrido un error inesperado. Vuelve a intentarlo más tarde.',
      );
    }
  }
}
