import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user';
import { UserUpdate } from './user-update';

describe('UserUpdate', () => {
  let component: UserUpdate;
  let fixture: ComponentFixture<UserUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpdate],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } }
        },
        { provide: UserService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
