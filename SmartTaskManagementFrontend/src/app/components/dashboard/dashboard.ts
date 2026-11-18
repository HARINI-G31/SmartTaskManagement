import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserResponse, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  readonly title =
    typeof this.route.snapshot.data['title'] === 'string'
      ? this.route.snapshot.data['title']
      : 'Dashboard';
  readonly user = this.authService.getCurrentUser();
  readonly UserRole = UserRole;

  users: UserResponse[] = [];
  isLoading = true;
  errorMessage = '';

  get totalEmployees(): number {
    return this.users.length;
  }

  get totalAdmins(): number {
    return this.users.filter(user => user.role === UserRole.Admin).length;
  }

  get totalManagers(): number {
    return this.users.filter(user => user.role === UserRole.Manager).length;
  }

  get totalEmployeeAccounts(): number {
    return this.users.filter(user => user.role === UserRole.Employee).length;
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Unable to load dashboard employees:', error);
        this.errorMessage = 'Unable to load dashboard statistics. Please try again.';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
