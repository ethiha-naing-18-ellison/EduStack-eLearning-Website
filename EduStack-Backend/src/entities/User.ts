import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
