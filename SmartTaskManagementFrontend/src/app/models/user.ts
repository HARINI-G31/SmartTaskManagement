
export enum UserRole {
  Admin = 0,
  Manager = 1,
  Employee = 2
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAtUtc: string;
  updatedAtUtc: string;
}
export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
