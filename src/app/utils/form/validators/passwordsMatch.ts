import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const parent = control.parent;
  if (!parent) {
    return null;
  }

  const password: string | undefined = parent.get('password')?.value;
  const confirmPassword: string | undefined = control.value;

  if (password !== confirmPassword) {
    return { passwordsdontmatch: true };
  }

  return null;
}
