
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRole, CreateUser } from '../../models/user';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css'
})
export class UserCreate {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  readonly UserRole = UserRole;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  userForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: [UserRole.Employee, Validators.required]
  });

  onSubmit(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();

    const request: CreateUser = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim(),
      password: formValue.password,
      role: Number(formValue.role) as UserRole
    };

    this.isSubmitting = true;

    this.userService.createUser(request).subscribe({
      next: response => {
        this.successMessage = `User ${response.firstName} registered successfully!`;
        this.userService.notifyUsersChanged();
        this.userForm.reset({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: UserRole.Employee
        });
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = this.authService.getErrorMessage(
          error,
          'Unable to register user. Please try again.'
        );
        this.isSubmitting = false;
      }
    });
  }
}
