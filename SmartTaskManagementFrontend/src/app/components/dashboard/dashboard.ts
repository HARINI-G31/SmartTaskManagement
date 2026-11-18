import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  readonly title =
    typeof this.route.snapshot.data['title'] === 'string'
      ? this.route.snapshot.data['title']
      : 'Dashboard';
  readonly user = this.authService.getCurrentUser();
  readonly UserRole = UserRole;

  users: UserResponse[] = [];
  isLoading = false;
  errorMessage = '';
  hasLoaded = false;

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
    if (this.user?.role === UserRole.Admin) {
      this.loadEmployees();
      this.userService.usersChanged$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.loadEmployees());
    }
  }

  refresh(): void {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.isLoading = false;
        this.hasLoaded = true;
      },
      error: error => {
        this.errorMessage = this.authService.getErrorMessage(
          error,
          'Unable to load dashboard statistics. Please try again.'
        );
        this.isLoading = false;
        this.hasLoaded = true;
      }
    });
  }
}
