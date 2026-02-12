import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Form } from '../../../components/form/form';
import { IFormInput } from '../../../interfaces/form/i-form-input';
import { Validators } from '@angular/forms';
import { ISignupUser } from '../../../interfaces/users/i-signup-user';
import { UsersService } from '../../../services/users-service';
import { passwordsMatch } from '../../../utils/form/validators/passwordsMatch';
import { min } from 'rxjs';
import { ISignupForm } from '../../../interfaces/users/i-signup-form';
import { email } from '@angular/forms/signals';

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
        this.signupForm.set(null);
      }
    });
  }

  private usersService = inject(UsersService);

  IsSignupFormValid: WritableSignal<boolean> = signal(false);
  signupForm: WritableSignal<ISignupForm | null> = signal(null);
  signupUser: Signal<ISignupUser | null> = computed(() => {
    const signupForm: ISignupForm | null = this.signupForm();

    if (!signupForm) {
      return null;
    }

    return {
      name: signupForm.name,
      last_name: signupForm.last_name,
      email: signupForm.email,
      username: signupForm.username,
      password: signupForm.password,
    };
  });

  inputs: IFormInput[] = [
    {
      name: 'name',
      label: 'Nombre',
      value: '',
      autocomplete: 'given-name',
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
      autocomplete: 'family-name',
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
      autocomplete: 'email',
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
      autocomplete: 'username',
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
      autocomplete: 'new-password',
      type: 'password',
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        passwordsMatch,
      ],
      validationErrorMessages: {
        required: 'El campo contraseña es obligatorio.',
        minlength: 'El campo contraseña debe tener al menos 8 caracteres.',
        maxlength: 'El campo contraseña no puede tener más de 100 caracteres.',
        pattern:
          'El campo contraseña debe incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.',
        passwordsdontmatch: 'Las contraseñas no coinciden.',
      },
    },
    {
      name: 'confirm_password',
      label: 'Confirma contraseña',
      value: '',
      autocomplete: 'new-password',
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
      console.log(errorResponse);
      this.generalError.set(
        errorResponse.error.message ||
          'Ha ocurrido un error inesperado. Vuelve a intentarlo más tarde.',
      );
    }
  }
}
