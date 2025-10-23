import { UserRole } from '@prisma/client';

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    avatar?: string;
  };
  token: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
