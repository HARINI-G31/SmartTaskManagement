
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { UserService } from '../../services/user';
import { UserResponse } from '../../models/user';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [],
  templateUrl: './user-delete.html',
  styleUrl: './user-delete.css'
})
export class UserDelete implements OnInit {

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  users: UserResponse[] = [];

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  // GET all users
  loadUsers(): void {

    console.log('Loading users started');

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({

      next: (response: UserResponse[]) => {

        console.log('API SUCCESS:', response);

        this.users = response;

        this.isLoading = false;

        this.cdr.detectChanges();

      },

      error: (error: HttpErrorResponse) => {

        console.error('API ERROR:', error);

        this.errorMessage = 'Unable to load users.';

        this.isLoading = false;

        this.cdr.detectChanges();

      }

    });
  }

  // DELETE user
  deleteUser(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmed) {
      return;
    }

    this.userService.deleteUser(id).subscribe({

      next: () => {

        this.users = this.users.filter(
          user => user.id !== id
        );

        this.successMessage = 'User deleted successfully!';
        this.userService.notifyUsersChanged();

        this.cdr.detectChanges();

      },

      error: (error: HttpErrorResponse) => {

        console.error('DELETE ERROR:', error);

        this.errorMessage = 'Failed to delete user.';

        this.cdr.detectChanges();

      }

    });
  }
}
