import { AbstractControlOptions, ValidatorFn } from '@angular/forms';

export interface IFormInput {
  name: string;
  type?: string;
  label: string;
  value: any;
  autocomplete?: string;
  validators: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  validationErrorMessages?: { [key: string]: string };
}
