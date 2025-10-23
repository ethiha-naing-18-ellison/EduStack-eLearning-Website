import { Request, Response } from 'express';
import Joi from 'joi';
import { ReviewService } from '@/services/ReviewService';
import { asyncHandler } from '@/middleware/error';
import { AuthRequest } from '@/middleware/auth';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  // Validation schemas
  private createReviewSchema = Joi.object({
    courseId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(1000),
  });

  private updateReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string().max(1000),
  });

  private reviewQuerySchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    rating: Joi.number().min(1).max(5),
    sortBy: Joi.string().valid('rating', 'createdAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  });

  // Create review
  createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.createReviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const userId = req.user!.id;
    const review = await this.reviewService.createReview(value, userId);
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  });

  // Get course reviews
  getCourseReviews = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = this.reviewQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const { courseId } = req.params;
    const result = await this.reviewService.getCourseReviews(courseId, value);
    
    res.status(200).json({
      success: true,
      message: 'Course reviews retrieved successfully',
      data: result,
    });
  });

  // Update review
  updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.updateReviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const { id } = req.params;
    const userId = req.user!.id;
    const review = await this.reviewService.updateReview(id, value, userId);
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  });

  // Delete review
  deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    
    await this.reviewService.deleteReview(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  });

  // Get review by ID
  getReviewById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const review = await this.reviewService.getReviewById(id);
    
    res.status(200).json({
      success: true,
      message: 'Review retrieved successfully',
      data: review,
    });
  });

  // Get user reviews
  getUserReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.reviewQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const userId = req.user!.id;
    const result = await this.reviewService.getUserReviews(userId, value);
    
    res.status(200).json({
      success: true,
      message: 'User reviews retrieved successfully',
      data: result,
    });
  });

  // Get course rating stats
  getCourseRatingStats = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const stats = await this.reviewService.getCourseRatingStats(courseId);
    
    res.status(200).json({
      success: true,
      message: 'Course rating stats retrieved successfully',
      data: stats,
    });
  });
}
