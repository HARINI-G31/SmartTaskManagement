
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { RegisterRequest } from '../../models/auth';
import { AuthService } from '../../services/auth';

const passwordsMatch: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password = control.get('password')?.value;
  const confirmation = control.get('confirmPassword')?.value;

  return password === confirmation
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly registerForm = this.formBuilder.nonNullable.group(
    {
      firstName: [
        '',
        [Validators.required, Validators.maxLength(100)]
      ],

      lastName: [
        '',
        [Validators.required, Validators.maxLength(100)]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ]
      ],

      password: [
        '',
        [Validators.required, Validators.minLength(8)]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]
    },
    {
      validators: passwordsMatch
    }
  );

  showPassword = false;
  showConfirmPassword = false;

  isSubmitting = false;
  errorMessage = '';

  submit(): void {

    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.registerForm.getRawValue();

    const request: RegisterRequest = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim(),
      password: formValue.password
    };

    this.authService.register(request).subscribe({

      next: () => {

        this.isSubmitting = false;
        this.cdr.detectChanges();

        void this.router.navigateByUrl('/login', {
          state: {
            registrationSuccess:
              'Your Employee account was created. You can now sign in.'
          }
        });

      },

      error: (error: HttpErrorResponse) => {

        this.isSubmitting = false;

        if (error.status === 409) {

          this.errorMessage = this.authService.getErrorMessage(
            error,
            'An account with this email address already exists.'
          );

        } else {

          this.errorMessage = this.authService.getErrorMessage(
            error,
            'Unable to create your account. Please try again.'
          );

        }

        console.log('HTTP Status:', error.status);
        console.log('Displayed error:', this.errorMessage);

        // Update the Angular view immediately
        this.cdr.detectChanges();

      }

    });

  }

  clearError(): void {
    this.errorMessage = '';
  }

}
