import { Progress, Prisma } from '@prisma/client';
import prisma from '@/config/database';
import { BaseRepository } from './BaseRepository';
import { CreateProgressData, UpdateProgressData } from '@/entities/Progress';

export class ProgressRepository extends BaseRepository<Progress> {
  async findById(id: string): Promise<Progress | null> {
    return prisma.progress.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
    userId?: string;
    courseId?: string;
    lessonId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Progress[]> {
    const {
      page = 1,
      limit = 10,
      userId,
      courseId,
      lessonId,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = options || {};

    const skip = (page - 1) * limit;

    const where: Prisma.ProgressWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (lessonId) {
      where.lessonId = lessonId;
    }

    const orderBy: Prisma.ProgressOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.ProgressOrderByWithRelationInput] = sortOrder;

    return prisma.progress.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  }

  async create(data: CreateProgressData): Promise<Progress> {
    return prisma.progress.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateProgressData): Promise<Progress> {
    return prisma.progress.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.progress.delete({
      where: { id },
    });
  }

  async count(options?: {
    userId?: string;
    courseId?: string;
    lessonId?: string;
  }): Promise<number> {
    const { userId, courseId, lessonId } = options || {};

    const where: Prisma.ProgressWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (lessonId) {
      where.lessonId = lessonId;
    }

    return prisma.progress.count({ where });
  }

  async upsertProgress(data: CreateProgressData): Promise<Progress> {
    return prisma.progress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId: data.userId,
          courseId: data.courseId,
          lessonId: data.lessonId || '',
        },
      },
      update: {
        progress: data.progress,
        completedAt: data.progress === 100 ? new Date() : null,
      },
      create: {
        ...data,
        completedAt: data.progress === 100 ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  }

  async getUserCourseProgress(userId: string, courseId: string) {
    const progress = await prisma.progress.findMany({
      where: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });

    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const completedLessons = progress.filter(p => p.progress === 100).length;
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
      courseId,
      totalLessons,
      completedLessons,
      progress: Math.round(overallProgress),
      lastAccessed: progress.length > 0 
        ? new Date(Math.max(...progress.map(p => p.updatedAt.getTime())))
        : null,
    };
  }
}
