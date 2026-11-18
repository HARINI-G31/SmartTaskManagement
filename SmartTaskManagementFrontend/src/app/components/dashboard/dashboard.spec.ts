import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Subject, of } from 'rxjs';

import { UserResponse, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let getUsers: ReturnType<typeof vi.fn>;

  const users: UserResponse[] = [
    {
      id: 'admin-id',
      firstName: 'Ada',
      lastName: 'Admin',
      email: 'ada@example.com',
      role: UserRole.Admin,
      createdAtUtc: '',
      updatedAtUtc: ''
    },
    {
      id: 'manager-id',
      firstName: 'Max',
      lastName: 'Manager',
      email: 'max@example.com',
      role: UserRole.Manager,
      createdAtUtc: '',
      updatedAtUtc: ''
    },
    {
      id: 'employee-id',
      firstName: 'Eli',
      lastName: 'Employee',
      email: 'eli@example.com',
      role: UserRole.Employee,
      createdAtUtc: '',
      updatedAtUtc: ''
    }
  ];

  beforeEach(async () => {
    getUsers = vi.fn(() => of(users));
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { title: 'Admin dashboard' } } }
        },
        {
          provide: AuthService,
          useValue: {
            getCurrentUser: () => ({
              id: 'admin-id',
              firstName: 'Ada',
              lastName: 'Admin',
              email: 'ada@example.com',
              role: UserRole.Admin
            })
          }
        },
        {
          provide: UserService,
          useValue: { getUsers, usersChanged$: new Subject<void>() }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render admin dashboard statistics from the users API', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent).toContain('Workforce overview');
    expect(element.textContent).toContain('Welcome, Ada Admin');
    expect(Array.from(element.querySelectorAll('.stat-card strong')).map(node => node.textContent?.trim()))
      .toEqual(['3', '1', '1', '1']);
    expect(element.querySelector('a[routerLink="/employees"]')).toBeTruthy();
  });

  it('should refresh live statistics when requested', () => {
    fixture.componentInstance.refresh();
    expect(getUsers).toHaveBeenCalledTimes(2);
  });
});
