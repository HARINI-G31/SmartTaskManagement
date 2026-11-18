import { Routes } from '@angular/router';

import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
import { CreateTask } from './features/tasks/components/create-task/create-task';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'tasks/create',
    component: CreateTask,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: '**', redirectTo: 'register' }
];
