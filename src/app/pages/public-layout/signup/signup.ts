import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { Form } from '../../../components/form/form';
import { IFormInput } from '../../../interfaces/form/i-form-input';
import { Validators } from '@angular/forms';
import { ISignupUser } from '../../../interfaces/users/i-signup-user';
import { UsersService } from '../../../services/users-service';
import { passwordsMatch } from '../../../utils/form/validators/passwordsMatch';

@Component({
  selector: 'app-signup',
  imports: [Form],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  constructor() {
    effect(() => {
      if (!this.IsSignupFormValid()) {
        this.signupUser.set(null);
      }
    });
  }

  private usersService = inject(UsersService);

  IsSignupFormValid: WritableSignal<boolean> = signal(false);
  signupUser: WritableSignal<ISignupUser | null> = signal(null);

  inputs: IFormInput[] = [
    {
      name: 'name',
      label: 'Nombre',
      value: '',
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      validationErrorMessages: {
        required: 'El campo Nombre es obligatorio.',
        minlength: 'El campo Nombre debe tener al menos 3 caracteres.',
        maxlength: 'El campo Nombre no puede tener más de 100 caracteres.',
      },
    },
    {
      name: 'last_name',
      label: 'Apellidos',
      value: '',
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
      validationErrorMessages: {
        required: 'El campo Apellidos es obligatorio.',
        minlength: 'El campo Apellidos debe tener al menos 3 caracteres.',
        maxlength: 'El campo Apellidos no puede tener más de 255 caracteres.',
      },
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      value: '',
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.email,
      ],
      validationErrorMessages: {
        required: 'El campo Correo electrónico es obligatorio.',
        minlength: 'El campo Correo electrónico debe tener al menos 3 caracteres.',
        maxlength: 'El campo Correo electrónico no puede tener más de 100 caracteres.',
        email: 'Formato de correo electrónico inválido.',
      },
    },
    {
      name: 'username',
      label: 'Usuario',
      value: '',
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      validationErrorMessages: {
        required: 'El campo Usuario es obligatorio.',
        minlength: 'El campo Usuario debe tener al menos 3 caracteres.',
        maxlength: 'El campo Usuario no puede tener más de 100 caracteres.',
      },
    },
    {
      name: 'password',
      label: 'Contraseña',
      value: '',
      type: 'password',
      validators: [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
        passwordsMatch,
      ],
      validationErrorMessages: {
        required: 'El campo contraseña es obligatorio.',
        pattern:
          'El campo contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.',
        passwordsdontmatch: 'Las contraseñas no coinciden.',
      },
    },
    {
      name: 'confirm_password',
      label: 'Confirma contraseña',
      value: '',
      type: 'password',
      validators: [Validators.required, passwordsMatch],
      validationErrorMessages: {
        required: 'El campo Confirma contraseña es obligatorio.',
        passwordsdontmatch: 'Las contraseñas no coinciden.',
      },
    },
  ];

  generalError: WritableSignal<string> = signal('');

  async signup() {
    this.generalError.set('');
    const signupUser: ISignupUser | null = this.signupUser();

    if (!signupUser) {
      this.generalError.set('Credenciales incorrectas.');
      return;
    }
    try {
      await this.usersService.signup(signupUser);
    } catch (errorResponse: any) {
      this.generalError.set(
        errorResponse.message || 'Ha ocurrido un error inesperado. Vuelve a intentarlo más tarde.',
      );
    }
  }
}
