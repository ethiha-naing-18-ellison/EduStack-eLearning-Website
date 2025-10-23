import { Category, Prisma } from '@prisma/client';
import prisma from '@/config/database';
import { BaseRepository } from './BaseRepository';
import { CreateCategoryData, UpdateCategoryData } from '@/entities/Category';

export class CategoryRepository extends BaseRepository<Category> {
  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Category[]> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
    } = options || {};

    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.CategoryOrderByWithRelationInput] = sortOrder;

    return prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });
  }

  async create(data: CreateCategoryData): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async count(options?: {
    search?: string;
  }): Promise<number> {
    const { search } = options || {};

    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.category.count({ where });
  }

  async getCategoriesWithStats() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const enrollmentCount = await prisma.enrollment.count({
          where: {
            course: {
              category: category.name,
            },
          },
        });

        return {
          ...category,
          courseCount: category._count.courses,
          enrollmentCount,
        };
      })
    );

    return categoriesWithStats;
  }
}
