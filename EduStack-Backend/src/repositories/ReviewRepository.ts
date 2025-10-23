import { Review, Prisma } from '@prisma/client';
import prisma from '@/config/database';
import { BaseRepository } from './BaseRepository';
import { CreateReviewData, UpdateReviewData } from '@/entities/Review';

export class ReviewRepository extends BaseRepository<Review> {
  async findById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
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

  async findByUserAndCourse(userId: string, courseId: string): Promise<Review | null> {
    return prisma.review.findUnique({
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
            avatar: true,
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
    courseId?: string;
    userId?: string;
    rating?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Review[]> {
    const {
      page = 1,
      limit = 10,
      courseId,
      userId,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options || {};

    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};

    if (courseId) {
      where.courseId = courseId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (rating) {
      where.rating = rating;
    }

    const orderBy: Prisma.ReviewOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.ReviewOrderByWithRelationInput] = sortOrder;

    return prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
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

  async create(data: CreateReviewData): Promise<Review> {
    return prisma.review.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
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

  async update(id: string, data: UpdateReviewData): Promise<Review> {
    return prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
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
    await prisma.review.delete({
      where: { id },
    });
  }

  async count(options?: {
    courseId?: string;
    userId?: string;
    rating?: number;
  }): Promise<number> {
    const { courseId, userId, rating } = options || {};

    const where: Prisma.ReviewWhereInput = {};

    if (courseId) {
      where.courseId = courseId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (rating) {
      where.rating = rating;
    }

    return prisma.review.count({ where });
  }

  async getCourseRatingStats(courseId: string) {
    const reviews = await prisma.review.findMany({
      where: { courseId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    };
  }
}
