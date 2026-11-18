import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { dashboardPathForRole } from '../../models/auth';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  showPassword = false;
  isSubmitting = false;
  errorMessage = '';
  readonly successMessage = this.readRegistrationMessage();

  submit(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const credentials = this.loginForm.getRawValue();
    credentials.email = credentials.email.trim();

    this.authService.login(credentials).subscribe({
      next: response => {
        this.isSubmitting = false;
        const route = dashboardPathForRole(response.user.role);
        void this.router.navigateByUrl(route);
      },
      error: error => {
        this.isSubmitting = false;
        this.errorMessage = this.authService.getErrorMessage(
          error,
          'Unable to sign in. Please try again.'
        );
      }
    });
  }

  private readRegistrationMessage(): string {
    const state: unknown = window.history.state;
    if (
      typeof state === 'object' &&
      state !== null &&
      'registrationSuccess' in state &&
      typeof state.registrationSuccess === 'string'
    ) {
      return state.registrationSuccess;
    }

    return '';
  }
}
