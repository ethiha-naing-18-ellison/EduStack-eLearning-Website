import { ReviewRepository } from '@/repositories/ReviewRepository';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ReviewListResponseDto, ReviewQueryDto } from '@/dto/review.dto';
import { createError } from '@/middleware/error';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createReview(data: CreateReviewDto, userId: string): Promise<ReviewResponseDto> {
    // Check if user is enrolled in the course
    // This would typically be done by checking enrollment status
    // For now, we'll assume the user is enrolled

    // Check if user has already reviewed this course
    const existingReview = await this.reviewRepository.findByUserAndCourse(userId, data.courseId);
    if (existingReview) {
      throw createError('You have already reviewed this course', 409);
    }

    const review = await this.reviewRepository.create({
      userId,
      courseId: data.courseId,
      rating: data.rating,
      comment: data.comment,
    });

    return {
      id: review.id,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async getCourseReviews(courseId: string, query: ReviewQueryDto): Promise<ReviewListResponseDto> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const reviews = await this.reviewRepository.findMany({
      courseId,
      ...query,
      page,
      limit,
    });

    const total = await this.reviewRepository.count({
      courseId,
      rating: query.rating,
    });

    const totalPages = Math.ceil(total / limit);

    // Get course rating stats
    const ratingStats = await this.reviewRepository.getCourseRatingStats(courseId);

    const reviewResponses: ReviewResponseDto[] = reviews.map(review => ({
      id: review.id,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return {
      reviews: reviewResponses,
      total,
      page,
      limit,
      totalPages,
      averageRating: ratingStats.averageRating,
      ratingDistribution: ratingStats.ratingDistribution,
    };
  }

  async updateReview(id: string, data: UpdateReviewDto, userId: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw createError('Review not found', 404);
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      throw createError('Unauthorized to update this review', 403);
    }

    const updatedReview = await this.reviewRepository.update(id, data);

    return {
      id: updatedReview.id,
      user: updatedReview.user,
      rating: updatedReview.rating,
      comment: updatedReview.comment,
      createdAt: updatedReview.createdAt,
      updatedAt: updatedReview.updatedAt,
    };
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw createError('Review not found', 404);
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      throw createError('Unauthorized to delete this review', 403);
    }

    await this.reviewRepository.delete(id);
  }

  async getReviewById(id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw createError('Review not found', 404);
    }

    return {
      id: review.id,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async getUserReviews(userId: string, query: ReviewQueryDto): Promise<ReviewListResponseDto> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const reviews = await this.reviewRepository.findMany({
      userId,
      ...query,
      page,
      limit,
    });

    const total = await this.reviewRepository.count({
      userId,
      rating: query.rating,
    });

    const totalPages = Math.ceil(total / limit);

    const reviewResponses: ReviewResponseDto[] = reviews.map(review => ({
      id: review.id,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return {
      reviews: reviewResponses,
      total,
      page,
      limit,
      totalPages,
      averageRating: 0, // Not applicable for user reviews
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  async getCourseRatingStats(courseId: string) {
    return this.reviewRepository.getCourseRatingStats(courseId);
  }
}
