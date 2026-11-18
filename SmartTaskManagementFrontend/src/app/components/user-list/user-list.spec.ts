import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { UserList } from './user-list';
import { UserResponse, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

describe('UserList', () => {
  let component: UserList;
  let fixture: ComponentFixture<UserList>;

  const users: UserResponse[] = [
    {
      id: 'employee-001',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.com',
      role: 2,
      createdAtUtc: '',
      updatedAtUtc: ''
    },
    {
      id: 'employee-002',
      firstName: 'Jamie',
      lastName: 'Taylor',
      email: 'jamie@example.com',
      role: 2,
      createdAtUtc: '',
      updatedAtUtc: ''
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getErrorMessage: (_error: unknown, fallback: string) => fallback
          }
        },
        {
          provide: UserService,
          useValue: {
            getUsers: () => of(users),
            usersChanged$: of(),
            deleteUser: () => of(undefined),
            notifyUsersChanged: () => undefined
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searches by employee ID, first name, last name, and email', () => {
    for (const query of ['EMPLOYEE-001', 'Alex', 'Morgan', 'ALEX@EXAMPLE.COM']) {
      component.onSearchChange(query);
      expect(component.filteredUsers.map(user => user.id)).toEqual(['employee-001']);
    }
  });

  it('filters by role and resets the current page when filters change', () => {
    component.onRoleFilterChange({
      target: { value: String(UserRole.Employee) }
    } as unknown as Event);

    expect(component.filteredUsers.map(user => user.role)).toEqual([UserRole.Employee, UserRole.Employee]);
    component.currentPage = 3;
    component.onSearchChange('Alex');
    expect(component.currentPage).toBe(1);
  });

  it('paginates filtered directory results', () => {
    component.users = Array.from({ length: 12 }, (_, index) => ({
      ...users[0],
      id: `page-${index + 1}`
    }));

    expect(component.totalPages).toBe(2);
    expect(component.pagedUsers).toHaveLength(10);
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.pagedUsers).toHaveLength(2);
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });
});
