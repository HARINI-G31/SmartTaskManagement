import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserResponse, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  readonly UserRole = UserRole;
  readonly pageSize = 10;

  users: UserResponse[] = [];
  searchTerm = '';
  roleFilter: UserRole | 'all' = 'all';
  currentPage = 1;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  deletingUserId: string | null = null;

  get filteredUsers(): UserResponse[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    return this.users.filter(user => {
      const matchesSearch =
        !query ||
        [user.id, user.firstName, user.lastName, user.email].some(value =>
          value.toLocaleLowerCase().includes(query)
        );
      return matchesSearch && (this.roleFilter === 'all' || user.role === this.roleFilter);
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  get pagedUsers(): UserResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadUsers();
    this.userService.usersChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadUsers());
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.authService.getErrorMessage(
          error,
          'Unable to load employee records. Please try again.'
        );
        this.isLoading = false;
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  onRoleFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.roleFilter = value === 'all' ? 'all' : Number(value) as UserRole;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.roleFilter = 'all';
    this.currentPage = 1;
  }

  roleName(role: UserRole): string {
    switch (role) {
      case UserRole.Admin:
        return 'Admin';
      case UserRole.Manager:
        return 'Manager';
      case UserRole.Employee:
        return 'Employee';
      default:
        return 'Unknown';
    }
  }

  deleteUser(user: UserResponse): void {
    if (!window.confirm(`Delete the account for ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    this.deletingUserId = user.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.deletingUserId = null;
        this.successMessage = `${user.firstName} ${user.lastName} was deleted.`;
        this.userService.notifyUsersChanged();
      },
      error: error => {
        this.deletingUserId = null;
        this.errorMessage = this.authService.getErrorMessage(
          error,
          'Unable to delete this account. Please try again.'
        );
      }
    });
  }

  previousPage(): void {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage(): void {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }
}
