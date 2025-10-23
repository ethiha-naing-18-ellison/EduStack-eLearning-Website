import { Course, Prisma, CourseLevel } from '@prisma/client';
import prisma from '@/config/database';
import { BaseRepository } from './BaseRepository';
import { CreateCourseData, UpdateCourseData } from '@/entities/Course';

export class CourseRepository extends BaseRepository<Course> {
  async findById(id: string): Promise<Course | null> {
    return prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
        enrollments: true,
        reviews: true,
      },
    });
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    level?: CourseLevel;
    minPrice?: number;
    maxPrice?: number;
    instructorId?: string;
    isPublished?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Course[]> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      level,
      minPrice,
      maxPrice,
      instructorId,
      isPublished,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options || {};

    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    const orderBy: Prisma.CourseOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.CourseOrderByWithRelationInput] = sortOrder;

    return prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });
  }

  async create(data: CreateCourseData): Promise<Course> {
    return prisma.course.create({
      data,
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateCourseData): Promise<Course> {
    return prisma.course.update({
      where: { id },
      data,
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id },
    });
  }

  async count(options?: {
    search?: string;
    category?: string;
    level?: CourseLevel;
    minPrice?: number;
    maxPrice?: number;
    instructorId?: string;
    isPublished?: boolean;
  }): Promise<number> {
    const { search, category, level, minPrice, maxPrice, instructorId, isPublished } = options || {};

    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    return prisma.course.count({ where });
  }

  async getCourseStats(courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        enrollments: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!course) return null;

    const enrollmentCount = course.enrollments.length;
    const reviews = course.reviews;
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    return {
      enrollmentCount,
      reviewCount: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }
}
