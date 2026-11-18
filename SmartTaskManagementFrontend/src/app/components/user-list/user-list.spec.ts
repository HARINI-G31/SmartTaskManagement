import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UserList } from './user-list';
import { UserResponse } from '../../models/user';
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
        { provide: UserService, useValue: { getUsers: () => of(users) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match employee IDs and emails without searching names', () => {
    component.searchTerm = 'EMPLOYEE-001';
    expect(component.filteredUsers.map(user => user.id)).toEqual(['employee-001']);

    component.searchTerm = 'JAMIE@EXAMPLE.COM';
    expect(component.filteredUsers.map(user => user.id)).toEqual(['employee-002']);

    component.searchTerm = 'Morgan';
    expect(component.filteredUsers).toEqual([]);
  });

  it('should show no-match feedback and restore results when search is cleared', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'missing@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No employees found');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(0);

    const clearButton = fixture.nativeElement.querySelector('.clear-search') as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('No employees found');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
  });
});
