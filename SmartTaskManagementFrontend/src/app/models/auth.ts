import { UserRole } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: UserRole;
}

export interface AuthResponseDto {
  token: string | null;
  user: AuthUserDto;
}

export interface AuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
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
