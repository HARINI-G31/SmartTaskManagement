import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UserRole } from '../../models/user';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { UserCreate } from './user-create';

describe('UserCreate', () => {
  let component: UserCreate;
  let fixture: ComponentFixture<UserCreate>;
  const createUser = vi.fn();
  const notifyUsersChanged = vi.fn();

  beforeEach(async () => {
    createUser.mockReset();
    notifyUsersChanged.mockReset();
    await TestBed.configureTestingModule({
      imports: [UserCreate],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getErrorMessage: (_error: unknown, fallback: string) => fallback
          }
        },
        {
          provide: UserService,
          useValue: { createUser, notifyUsersChanged }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits the initial password and role and announces the new account', () => {
    createUser.mockReturnValue(of({
      id: 'new-id',
      firstName: 'Sam',
      lastName: 'User',
      email: 'sam@example.com',
      role: UserRole.Employee,
      createdAtUtc: '',
      updatedAtUtc: ''
    }));

    component.userForm.setValue({
      firstName: ' Sam ',
      lastName: ' User ',
      email: 'sam@example.com',
      password: 'securepass123',
      role: UserRole.Employee
    });

    component.onSubmit();

    expect(createUser).toHaveBeenCalledWith({
      firstName: 'Sam',
      lastName: 'User',
      email: 'sam@example.com',
      password: 'securepass123',
      role: UserRole.Employee
    });
    expect(notifyUsersChanged).toHaveBeenCalledOnce();
    expect(component.successMessage).toContain('Sam registered successfully');
  });
});
