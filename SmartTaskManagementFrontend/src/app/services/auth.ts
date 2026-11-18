import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import {
  AuthResponseDto,
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest
} from '../models/auth';
import { UserRole } from '../models/user';

export const API_BASE_URL = 'https://localhost:7016/api';

const TOKEN_STORAGE_KEY = 'smart-task-management-token';
const USER_STORAGE_KEY = 'smart-task-management-user';

type JwtPayload = Record<string, unknown>;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(credentials: LoginRequest): Observable<AuthResponseDto> {
    return this.http
      .post<AuthResponseDto>(`${API_BASE_URL}/Auth/login`, credentials)
      .pipe(tap(response => this.storeAuthentication(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(
      `${API_BASE_URL}/Auth/register`,
      request
    );
  }

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload || this.isExpired(payload)) {
      this.clearAuthenticationData();
      return null;
    }

    return token;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getCurrentUser(): AuthenticatedUser | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const claims = this.decodeToken(token);
    const storedUser = this.readStoredUser();
    const role =
      this.readRoleClaim(claims) ??
      (storedUser ? this.toRole(storedUser.role) : null);

    if (role === null) {
      return null;
    }

    return {
      id:
        this.readStringClaim(claims, [
          'sub',
          'nameid',
          'nameidentifier',
          'userid',
          'id'
        ]) ?? storedUser?.id ?? '',
      email:
        this.readStringClaim(claims, [
          'email',
          'emailaddress',
          'unique_name'
        ]) ?? storedUser?.email ?? '',
      firstName: storedUser?.firstName ?? '',
      lastName: storedUser?.lastName ?? '',
      role
    };
  }

  getCurrentRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  logout(): void {
    this.clearAuthenticationData();
  }

  getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const body: unknown = error.error;
      if (typeof body === 'string' && body.trim()) {
        return body;
      }

      if (this.isRecord(body)) {
        const validationErrors = body['errors'];
        if (this.isRecord(validationErrors)) {
          const firstError = Object.values(validationErrors)
            .flatMap(value => (Array.isArray(value) ? value : [value]))
            .find(value => typeof value === 'string' && value.trim());
          if (typeof firstError === 'string') {
            return firstError;
          }
        }

        for (const key of ['detail', 'message', 'title']) {
          const message = body[key];
          if (typeof message === 'string' && message.trim()) {
            return message;
          }
        }
      }

      if (error.status === 0) {
        return 'Unable to connect to the server. Please try again.';
      }
      if (error.status === 401) {
        return 'Invalid email or password.';
      }
    } else if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  }

  clearAuthenticationData(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  private storeAuthentication(response: AuthResponseDto): void {
    const token = response?.token;
    const user = response?.user;
    const payload = typeof token === 'string' ? this.decodeToken(token) : null;

    if (!token || !payload || this.isExpired(payload)) {
      throw new Error('The server did not return a valid authentication token.');
    }

    const role =
      this.readRoleClaim(payload) ??
      (user ? this.toRole(user.role) : null);
    if (role === null || !user) {
      throw new Error('The server returned incomplete account information.');
    }

    const authenticatedUser: AuthenticatedUser = {
      id:
        this.readStringClaim(payload, [
          'sub',
          'nameid',
          'nameidentifier',
          'userid',
          'id'
        ]) ?? user.id,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email:
        this.readStringClaim(payload, [
          'email',
          'emailaddress',
          'unique_name'
        ]) ?? user.email ?? '',
      role
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
  }

  private readStoredUser(): AuthenticatedUser | null {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    if (!value) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(value);
      if (
        this.isRecord(parsed) &&
        typeof parsed['id'] === 'string' &&
        typeof parsed['firstName'] === 'string' &&
        typeof parsed['lastName'] === 'string' &&
        typeof parsed['email'] === 'string'
      ) {
        const role = this.toRole(parsed['role']);
        if (role !== null) {
          return {
            id: parsed['id'],
            firstName: parsed['firstName'],
            lastName: parsed['lastName'],
            email: parsed['email'],
            role
          };
        }
      }
    } catch {
      return null;
    }

    return null;
  }

  private decodeToken(token: string): JwtPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    try {
      const encodedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = encodedPayload.padEnd(
        Math.ceil(encodedPayload.length / 4) * 4,
        '='
      );
      const binaryPayload = atob(paddedPayload);
      const bytes = Uint8Array.from(binaryPayload, character =>
        character.charCodeAt(0)
      );
      const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));
      return this.isRecord(payload) ? payload : null;
    } catch {
      return null;
    }
  }

  private isExpired(payload: JwtPayload): boolean {
    const expiration = payload['exp'];
    if (expiration === undefined) {
      return false;
    }

    const expirationSeconds =
      typeof expiration === 'number'
        ? expiration
        : typeof expiration === 'string'
          ? Number(expiration)
          : Number.NaN;

    return (
      !Number.isFinite(expirationSeconds) ||
      expirationSeconds <= Math.floor(Date.now() / 1000)
    );
  }

  private readRoleClaim(payload: JwtPayload | null): UserRole | null {
    const claim = this.readClaim(payload, ['role', 'roles']);
    return this.toRole(claim);
  }

  private readStringClaim(
    payload: JwtPayload | null,
    aliases: string[]
  ): string | null {
    const claim = this.readClaim(payload, aliases);
    return typeof claim === 'string' && claim ? claim : null;
  }

  private readClaim(
    payload: JwtPayload | null,
    aliases: string[]
  ): unknown {
    if (!payload) {
      return null;
    }

    const normalizedAliases = aliases.map(alias => alias.toLowerCase());
    for (const [key, value] of Object.entries(payload)) {
      const normalizedKey = key.toLowerCase();
      if (
        normalizedAliases.includes(normalizedKey) ||
        normalizedAliases.some(alias => normalizedKey.endsWith(`/${alias}`))
      ) {
        return value;
      }
    }

    return null;
  }

  private toRole(value: unknown): UserRole | null {
    const role =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim()
          ? Number.isNaN(Number(value))
            ? value
            : Number(value)
          : null;

    switch (role) {
      case UserRole.Admin:
      case 'Admin':
        return UserRole.Admin;
      case UserRole.Manager:
      case 'Manager':
        return UserRole.Manager;
      case UserRole.Employee:
      case 'Employee':
        return UserRole.Employee;
      default:
        return null;
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
