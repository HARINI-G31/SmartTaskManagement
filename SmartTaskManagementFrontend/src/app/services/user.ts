import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import {
  CreateUser,
  UpdateUser,
  UserResponse
} from '../models/user';
import { API_BASE_URL } from './auth';

export const USERS_API_URL = `${API_BASE_URL}/Users`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);
  private readonly usersChanged = new Subject<void>();
  readonly usersChanged$ = this.usersChanged.asObservable();

  createUser(user: CreateUser): Observable<UserResponse> {
    return this.http.post<UserResponse>(USERS_API_URL, user);
  }

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(USERS_API_URL);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${USERS_API_URL}/${id}`);
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${USERS_API_URL}/me`);
  }

  updateUser(id: string, user: UpdateUser): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${USERS_API_URL}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${USERS_API_URL}/${id}`);
  }

  notifyUsersChanged(): void {
    this.usersChanged.next();
  }
}