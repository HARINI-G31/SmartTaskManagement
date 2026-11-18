import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../../services/auth';
import { UserRole } from '../../models/user';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly user = this.authService.getCurrentUser();
  readonly UserRole = UserRole;
  title = 'Dashboard';

  ngOnInit(): void {
    this.updateTitle();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updateTitle());
  }

  get dashboardPath(): string {
    switch (this.user?.role) {
      case UserRole.Admin:
        return '/admin-dashboard';
      case UserRole.Manager:
        return '/manager-dashboard';
      case UserRole.Employee:
        return '/employee-dashboard';
      default:
        return '/login';
    }
  }

  get roleName(): string {
    switch (this.user?.role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.Manager:
        return 'Manager';
      case UserRole.Employee:
        return 'Employee';
      default:
        return 'User';
    }
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }

  private updateTitle(): void {
    let activeRoute = this.route.firstChild;
    while (activeRoute?.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    const title = activeRoute?.snapshot.data['title'];
    this.title = typeof title === 'string' ? title : 'Dashboard';
  }
}
