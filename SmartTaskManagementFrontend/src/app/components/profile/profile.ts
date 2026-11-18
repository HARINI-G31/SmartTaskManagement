import { Component, OnInit, inject } from '@angular/core';

import { UserResponse, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  user: UserResponse | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getCurrentUser().subscribe({
      next: user => {
        this.user = user;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.authService.getErrorMessage(
          error,
          'Unable to load your profile. Please try again.'
        );
        this.isLoading = false;
      }
    });
  }

  roleName(role: UserRole): string {
    switch (role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.Manager:
        return 'Manager';
      case UserRole.Employee:
        return 'Employee';
      default:
        return 'Unknown';
    }
  }
}
