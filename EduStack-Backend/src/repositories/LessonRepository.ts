import { Lesson, Prisma } from '@prisma/client';
import prisma from '@/config/database';
import { BaseRepository } from './BaseRepository';
import { CreateLessonData, UpdateLessonData } from '@/entities/Lesson';

export class LessonRepository extends BaseRepository<Lesson> {
  async findById(id: string): Promise<Lesson | null> {
    return prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
    courseId?: string;
    isPublished?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Lesson[]> {
    const {
      page = 1,
      limit = 10,
      courseId,
      isPublished,
      sortBy = 'order',
      sortOrder = 'asc',
    } = options || {};

    const skip = (page - 1) * limit;

    const where: Prisma.LessonWhereInput = {};

    if (courseId) {
      where.courseId = courseId;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    const orderBy: Prisma.LessonOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.LessonOrderByWithRelationInput] = sortOrder;

    return prisma.lesson.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateLessonData): Promise<Lesson> {
    return prisma.lesson.create({
      data,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateLessonData): Promise<Lesson> {
    return prisma.lesson.update({
      where: { id },
      data,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.lesson.delete({
      where: { id },
    });
  }

  async count(options?: {
    courseId?: string;
    isPublished?: boolean;
  }): Promise<number> {
    const { courseId, isPublished } = options || {};

    const where: Prisma.LessonWhereInput = {};

    if (courseId) {
      where.courseId = courseId;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    return prisma.lesson.count({ where });
  }

  async getLessonsWithProgress(courseId: string, userId: string) {
    const lessons = await this.findMany({ courseId, isPublished: true });

    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const progress = await prisma.progress.findUnique({
          where: {
            userId_courseId_lessonId: {
              userId,
              courseId,
              lessonId: lesson.id,
            },
          },
        });

        return {
          ...lesson,
          progress: progress?.progress || 0,
          completedAt: progress?.completedAt,
        };
      })
    );

    return lessonsWithProgress;
  }
}
