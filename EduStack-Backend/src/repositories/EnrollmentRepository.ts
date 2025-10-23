import { Enrollment, Prisma, EnrollmentStatus } from '@prisma/client';
import prisma from '@/config/database';
import { BaseRepository } from './BaseRepository';
import { CreateEnrollmentData, UpdateEnrollmentData } from '@/entities/Enrollment';

export class EnrollmentRepository extends BaseRepository<Enrollment> {
  async findById(id: string): Promise<Enrollment | null> {
    return prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    return prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
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
    userId?: string;
    courseId?: string;
    status?: EnrollmentStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Enrollment[]> {
    const {
      page = 1,
      limit = 10,
      userId,
      courseId,
      status,
      sortBy = 'enrolledAt',
      sortOrder = 'desc',
    } = options || {};

    const skip = (page - 1) * limit;

    const where: Prisma.EnrollmentWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (status) {
      where.status = status;
    }

    const orderBy: Prisma.EnrollmentOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.EnrollmentOrderByWithRelationInput] = sortOrder;

    return prisma.enrollment.findMany({
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
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateEnrollmentData): Promise<Enrollment> {
    return prisma.enrollment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateEnrollmentData): Promise<Enrollment> {
    return prisma.enrollment.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            instructor: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.enrollment.delete({
      where: { id },
    });
  }

  async count(options?: {
    userId?: string;
    courseId?: string;
    status?: EnrollmentStatus;
  }): Promise<number> {
    const { userId, courseId, status } = options || {};

    const where: Prisma.EnrollmentWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (status) {
      where.status = status;
    }

    return prisma.enrollment.count({ where });
  }

  async getUserEnrollments(userId: string, options?: {
    page?: number;
    limit?: number;
    status?: EnrollmentStatus;
  }) {
    const enrollments = await this.findMany({
      userId,
      ...options,
    });

    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await prisma.progress.findMany({
          where: {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
          },
        });

        const totalLessons = await prisma.lesson.count({
          where: { courseId: enrollment.courseId },
        });

        const completedLessons = progress.filter(p => p.progress === 100).length;
        const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return {
          ...enrollment,
          progress: {
            progress: Math.round(overallProgress),
            completedLessons,
            totalLessons,
          },
        };
      })
    );

    return enrollmentsWithProgress;
  }
}
