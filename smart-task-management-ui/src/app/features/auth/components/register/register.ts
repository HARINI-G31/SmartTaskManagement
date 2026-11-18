import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  readonly registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const form = this.registerForm.getRawValue();

    if (form.password !== form.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      email: form.email.trim(),
      password: form.password
    }).subscribe({
      next: response => {
        this.isLoading = false;
        this.successMessage = response.message ||
          'Registration successful.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: error => {
        this.isLoading = false;

        const errors = error.error?.errors;

        this.errorMessage =
          error.error?.message ||
          (Array.isArray(errors) ? errors.join(' ') : null) ||
          'Registration failed. Please try again.';
      }
    });
  }
}
