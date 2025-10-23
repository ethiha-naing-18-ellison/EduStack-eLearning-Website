import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = require('@/config/database').default;
  }

  abstract findById(id: string): Promise<T | null>;
  abstract findMany(options?: any): Promise<T[]>;
  abstract create(data: any): Promise<T>;
  abstract update(id: string, data: any): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
