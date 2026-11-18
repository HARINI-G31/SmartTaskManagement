import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../services/user';
import { UserResponse, UserRole, UpdateUser } from '../../models/user';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './user-update.html',
  styleUrl: './user-update.css'
})
export class UserUpdate {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  userId: string = '';

  message: string = '';

  user: UserResponse | null = null;

  UserRole = UserRole;

  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    role: [UserRole.Employee, Validators.required]
  });

  // GET: Load user details using ID
  loadUser(): void {

    if (!this.userId.trim()) {
      this.message = 'Please enter a user ID';
      return;
    }

    this.userService.getUserById(this.userId).subscribe({

      next: (response: UserResponse) => {

        this.user = response;

        this.userForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          role: response.role
        });

        this.message = 'User details loaded successfully';

      },

      error: (error) => {
        console.error(error);
        this.message = 'Unable to load user details';
      }

    });
  }

  // PUT: Update user details
  updateUser(): void {

    if (!this.userId.trim() || !this.user) {
      this.message = 'Please load a user first';
      return;
    }

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.message = 'Please enter valid details';
      return;
    }

    const updatedUser: UpdateUser = {
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      email: this.userForm.value.email!,
      role: this.userForm.value.role!
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe({

      next: (response: UserResponse) => {
        this.message = 'User updated successfully';
        this.user = response;
      },

      error: (error) => {
        console.error(error);
        this.message = 'Failed to update user';
      }

    });
  }
}