
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserRole, CreateUser, UserResponse } from '../../models/user';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css'
})
export class UserCreate {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  UserRole = UserRole;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  userForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
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
      role: Number(formValue.role) as UserRole
    };

    this.isSubmitting = true;

    this.userService.createUser(request).subscribe({
      next: (response: UserResponse) => {
        this.successMessage = `User ${response.firstName} registered successfully!`;
        this.userForm.reset({
          firstName: '',
          lastName: '',
          email: '',
          role: UserRole.Employee
        });
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to register user. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
