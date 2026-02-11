import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IFormInput } from '../../interfaces/form/i-form-input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  inputs: InputSignal<IFormInput[]> = input<IFormInput[]>([]);
  showForgotPassword: InputSignal<boolean> = input(false);

  isFormValidOutput: OutputEmitterRef<boolean> = output();
  formValueOutput: OutputEmitterRef<any> = output();

  form: FormGroup = new FormGroup({});

  showPassword: WritableSignal<boolean> = signal(false);
  showConfirmPassword: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.inputs().forEach((input) => {
      this.form.addControl(input.name, new FormControl(input.value, input.validators));
    });
  }

  togglePasswordVisibility(name: string) {
    if (name === 'password') {
      this.showPassword.set(!this.showPassword());
    } else if (name === 'confirm_password') {
      this.showConfirmPassword.set(!this.showConfirmPassword());
    }
  }

  onInput() {
    if (this.form.valid) {
      this.isFormValidOutput.emit(true);
      this.formValueOutput.emit(this.form.value);
    } else {
      this.isFormValidOutput.emit(false);
    }
  }

  getControlErrors(control: AbstractControl | null, input: IFormInput): string[] {
    if (!control || !control.errors) {
      return [];
    }

    return Object.keys(control.errors).map(
      (errorKey) => input.validationErrorMessages?.[errorKey] ?? '',
    );
  }
}
