import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateUser,
  UpdateUser,
  UserResponse
} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7016/api/Users';

  // POST: Create a new user
  createUser(user: CreateUser): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user);
  }

  // GET: Get all users
  getUsers(): Observable<UserResponse[]> {
  return this.http.get<UserResponse[]>(this.apiUrl);
}

  // GET: Get user by ID
  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  // PUT: Update an existing user
  updateUser(id: string, user: UpdateUser): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user);
  }
  deleteUser(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}