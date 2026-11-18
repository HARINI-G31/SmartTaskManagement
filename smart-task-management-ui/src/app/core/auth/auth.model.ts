
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userId: string;
  token: string;
  expiresAt: string;
}
