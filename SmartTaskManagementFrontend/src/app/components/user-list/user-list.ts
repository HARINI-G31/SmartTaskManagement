
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
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {

  // Inject UserService to communicate with the backend API
  private userService = inject(UserService);

  // Inject ChangeDetectorRef to refresh the component view
  private cdr = inject(ChangeDetectorRef);

  // Store all users received from the API
  users: UserResponse[] = [];

  searchTerm = '';

  get filteredUsers(): UserResponse[] {
    const query = this.searchTerm.trim().toLowerCase();

    if (!query) {
      return this.users;
    }

    return this.users.filter(user =>
      user.id.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  // Loading and error states
  isLoading = true;
  errorMessage = '';

  // Automatically load users when the component initializes
  ngOnInit(): void {
    this.loadUsers();
  }

  // Fetch all users from the backend
  loadUsers(): void {

    console.log('1. loadUsers() started');

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({

      // Executes when API returns successfully
      next: (response: UserResponse[]) => {

        console.log('2. API SUCCESS:', response);

        this.users = response;

        console.log('3. Users assigned:', this.users);
        console.log('4. User count:', this.users.length);

        this.isLoading = false;

        // Refresh the component view
        this.cdr.detectChanges();
      },

      // Executes when API request fails
      error: (error: HttpErrorResponse) => {

        console.error('API ERROR:', error);

        this.errorMessage = 'Unable to load users. Please try again.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      // Executes when the API request completes
      complete: () => {
        console.log('5. API request completed');
      }

    });

    console.log('6. Subscription created');
  }
}
