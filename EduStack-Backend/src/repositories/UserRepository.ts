import { User, Prisma } from '@prisma/client';
import prisma from '@/config/database';
import { BaseRepository } from './BaseRepository';
import { CreateUserData, UpdateUserData } from '@/entities/User';

export class UserRepository extends BaseRepository<User> {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    const { page = 1, limit = 10, search, role, isActive } = options || {};
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role as any;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async count(options?: {
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<number> {
    const { search, role, isActive } = options || {};

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role as any;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return prisma.user.count({ where });
  }
}
