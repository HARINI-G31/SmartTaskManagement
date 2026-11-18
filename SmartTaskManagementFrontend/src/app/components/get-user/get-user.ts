import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { UserService } from '../../services/user';
import { UserResponse } from '../../models/user';

@Component({
  selector: 'app-get-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './get-user.html',
  styleUrl: './get-user.css'
})
export class GetUser {

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  userId = '';
  user: UserResponse | null = null;

  isLoading = false;
  errorMessage = '';

  searchUser(): void {

    const id = this.userId.trim();

    if (!id) {
      this.errorMessage = 'Please enter a User ID.';
      this.user = null;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.user = null;

    this.userService.getUserById(id).subscribe({

      next: (response: UserResponse) => {
        this.user = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Get User API Error:', error);

        this.user = null;
        this.isLoading = false;

        this.errorMessage =
          error.status === 404
            ? 'User not found. Please check the User ID.'
            : 'Unable to retrieve user. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }
}