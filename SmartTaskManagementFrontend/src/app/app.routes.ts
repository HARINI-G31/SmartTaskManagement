import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user';
import { AdminLayout } from './components/admin-layout/admin-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { GetUser } from './components/get-user/get-user';
import { Login } from './components/login/login';
import { ModulePlaceholder } from './components/module-placeholder/module-placeholder';
import { Profile } from './components/profile/profile';
import { Register } from './components/register/register';
import { UserCreate } from './components/user-create/user-create';
import { UserDelete } from './components/user-delete/user-delete';
import { UserList } from './components/user-list/user-list';
import { UserUpdate } from './components/user-update/user-update';

const adminOnly = [UserRole.Admin];
const managerAndAdmin = [UserRole.Admin, UserRole.Manager];

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin-dashboard',
        component: Dashboard,
        canActivate: [roleGuard],
        data: { roles: adminOnly, title: 'Admin Dashboard' }
      },
      {
        path: 'manager-dashboard',
        component: Dashboard,
        canActivate: [roleGuard],
        data: { roles: [UserRole.Manager], title: 'Manager Dashboard' }
      },
      {
        path: 'employee-dashboard',
        component: Dashboard,
        canActivate: [roleGuard],
        data: { roles: [UserRole.Employee], title: 'Employee Dashboard' }
      },
      {
        path: 'employees',
        component: UserList,
        canActivate: [roleGuard],
        data: { roles: adminOnly, title: 'Employee Management' }
      },
      {
        path: 'users',
        redirectTo: 'employees',
        pathMatch: 'full'
      },
      {
        path: 'user-create',
        component: UserCreate,
        canActivate: [roleGuard],
        data: { roles: adminOnly, title: 'Create Employee' }
      },
      {
        path: 'user-update',
        component: UserUpdate,
        canActivate: [roleGuard],
        data: { roles: adminOnly, title: 'Update Employee' }
      },
      {
        path: 'get-user',
        component: GetUser,
        canActivate: [roleGuard],
        data: { roles: adminOnly, title: 'Find Employee' }
      },
      {
        path: 'delete-users',
        component: UserDelete,
        canActivate: [roleGuard],
        data: { roles: adminOnly, title: 'Delete Employees' }
      },
      {
        path: 'profile',
        component: Profile,
        data: { title: 'Profile' }
      },
      {
        path: 'projects',
        component: ModulePlaceholder,
        canActivate: [roleGuard],
        data: {
          roles: managerAndAdmin,
          title: 'Projects',
          message: 'Project management will be available here.',
          description:
            'Project planning and team assignment will connect here when the Projects module is ready.'
        }
      },
      {
        path: 'tasks',
        component: ModulePlaceholder,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.Admin, UserRole.Manager, UserRole.Employee],
          title: 'Tasks',
          message: 'Task management will be available here.',
          description:
            'Assigned work and progress tracking will connect here when the Tasks module is ready.'
        }
      },
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
