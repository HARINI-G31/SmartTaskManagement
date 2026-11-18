import { Routes } from '@angular/router';

import { UserList } from './components/user-list/user-list';
import { UserUpdate } from './components/user-update/user-update';
import { UserDelete } from './components/user-delete/user-delete';
import { GetUser } from './components/get-user/get-user';
import { UserCreate } from './components/user-create/user-create';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { UserRole } from './models/user';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'user-create',
    component: UserCreate,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UserList,
    canActivate: [authGuard]
  },
  {
    path: 'user-update',
    component: UserUpdate,
    canActivate: [authGuard]
  },
  {
    path: 'get-user',
    component: GetUser,
    canActivate: [authGuard]
  },
  {
    path: 'delete-users',
    component: UserDelete,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'admin-dashboard',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Admin], title: 'Admin dashboard' }
  },
  {
    path: 'manager-dashboard',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Manager], title: 'Manager dashboard' }
  },
  {
    path: 'employee-dashboard',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Employee], title: 'Employee dashboard' }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
