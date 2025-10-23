import { Request, Response } from 'express';
import Joi from 'joi';
import { ProgressService } from '@/services/ProgressService';
import { asyncHandler } from '@/middleware/error';
import { AuthRequest } from '@/middleware/auth';

export class ProgressController {
  private progressService: ProgressService;

  constructor() {
    this.progressService = new ProgressService();
  }

  // Validation schemas
  private updateProgressSchema = Joi.object({
    lessonId: Joi.string(),
    progress: Joi.number().min(0).max(100).required(),
  });

  private progressQuerySchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    courseId: Joi.string(),
  });

  // Update progress
  updateProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.updateProgressSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const { courseId } = req.params;
    const userId = req.user!.id;
    const progress = await this.progressService.updateProgress(userId, courseId, value);
    
    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress,
    });
  });

  // Get user course progress
  getCourseProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user!.id;
    const progress = await this.progressService.getUserCourseProgress(userId, courseId);
    
    res.status(200).json({
      success: true,
      message: 'Course progress retrieved successfully',
      data: progress,
    });
  });

  // Get user progress
  getUserProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.progressQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const userId = req.user!.id;
    const progress = await this.progressService.getUserProgress(userId, value);
    
    res.status(200).json({
      success: true,
      message: 'Progress retrieved successfully',
      data: progress,
    });
  });

  // Get progress by ID
  getProgressById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const progress = await this.progressService.getProgressById(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Progress retrieved successfully',
      data: progress,
    });
  });

  // Delete progress
  deleteProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    
    await this.progressService.deleteProgress(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Progress deleted successfully',
    });
  });

  // Get progress stats
  getProgressStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const stats = await this.progressService.getProgressStats(userId);
    
    res.status(200).json({
      success: true,
      message: 'Progress stats retrieved successfully',
      data: stats,
    });
  });
}
